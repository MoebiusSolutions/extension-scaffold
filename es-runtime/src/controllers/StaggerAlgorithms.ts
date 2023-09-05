
import type {
  Dimensions, TopLeftPosition, StaggerStrategy, PositionOffset,
} from "../es-api";

type TransformContext = {
  percent: { height:number, width:number },
  em: { height:number, width:number }
}
type HalfSize = {
  halfWidth:number,
  halfHeight:number,
}
type StaggerSlot = {
  slotIndex: number,
  position:TopLeftPosition
}

function normalizeValueAsPixels(value:string | number, transformContext:TransformContext, dimension:'height' | 'width'):number {
  if (Number.isInteger(value)) {
      return Number(value)
  }
  value = value as string
  if (!value || value.length < 2) {
      return 0
  }
  let units = value.slice(-1)
  if (units === '%') {
      const percent = value.slice(0, -1);
      return Math.round(transformContext.percent[dimension] / 100 * Number(percent))
  }
  if (value.length < 3) {
      return 0
  }
  units = value.slice(-2)
  if (units === 'px') {
      return Number(value.slice(0, -2))
  }
  if (units === 'em') {
      // TODO(BCM): this is a huge assumption that we're normalizing the initial height/width
      //     we know we have the right pixel value already set on the transformContext for em
      //     but for any other case of "em" units, we don't know how to transform to pixels.
      return transformContext.em[dimension]
  }
  // return a reasonable default, but hopefully once we get this tested/documented
  // it will be a nearly never occurance that this block is reached outside development of new features
  const defaultValue = 500
  console.error(`No support for stagger position units(${units}) returning default value(${defaultValue})`)
  return defaultValue
}

function normalizeOffsetAsPixels(position:PositionOffset, transformContext:TransformContext) {
  return {
      vertical: normalizeValueAsPixels(position.vertical, transformContext, 'height'),
      horizontal: normalizeValueAsPixels(position.horizontal, transformContext, 'width')
  }
}

function normalizePostionAsPixels(position:TopLeftPosition, transformContext:TransformContext) {
  return {
      top: normalizeValueAsPixels(position.top, transformContext, 'height'),
      left: normalizeValueAsPixels(position.left, transformContext, 'width')
  }
}

function normalizeDimensionsAsPixels(dimensions:Dimensions, transformContext:TransformContext) {
  return {
      height: normalizeValueAsPixels(dimensions.height, transformContext, 'height'),
      width: normalizeValueAsPixels(dimensions.width, transformContext, 'width')
  }
}

/** gets position of panel calculated for slotIndex, decluttered from other panels along a diagonal assuming all in group used same init parmaeters */
function getDiagonalStaggerSlot(slotIndex:number, firstPosition:TopLeftPosition, offsetFromPrevious:PositionOffset, initialDimensions:Dimensions, transformContext:TransformContext):StaggerSlot {
  // normalize size into numeric pixels, and identify halfSize as a center point of panel
  const normalizedDimensions = normalizeDimensionsAsPixels(initialDimensions, transformContext);
  const initialHalfSize = { 
      halfWidth: Math.round(normalizedDimensions.width / 2),
      halfHeight: Math.round(normalizedDimensions.height / 2),
  }

  const normalizedOrigin = normalizePostionAsPixels(firstPosition, transformContext)
  const normalizedOffset = normalizeOffsetAsPixels(offsetFromPrevious, transformContext)

  const maxVerticalTiles = Math.floor((window.innerHeight - normalizedOrigin.top - normalizedDimensions.height) / (normalizedOffset.vertical || 1))
  const maxHorizontalTiles = Math.floor((window.innerWidth - normalizedOrigin.left - normalizedDimensions.width) / (normalizedOffset.horizontal || 1))
  
  const normalizedVerticalMultiplier = maxVerticalTiles > 0 ? slotIndex % maxVerticalTiles : slotIndex
  const normalizedHorizontalMultiplier = maxHorizontalTiles > 0 ? slotIndex % maxHorizontalTiles : slotIndex

  return { 
    slotIndex,
    position: { 
      top: `${normalizedOrigin.top + initialHalfSize.halfHeight + normalizedOffset.vertical * normalizedVerticalMultiplier}px`,
      left: `${normalizedOrigin.left + initialHalfSize.halfWidth + normalizedOffset.horizontal * normalizedHorizontalMultiplier}px`
    }
  }
}

/** gets position of panel calculated for slotIndex, in tile pattern sized for viewing window assuming all in group used same init parmaeters */
function getTiledStaggerSlot(slotIndex:number, firstPosition:TopLeftPosition, offsetFromPrevious:PositionOffset, initialDimensions:Dimensions, transformContext:TransformContext):StaggerSlot {
  // normalize size into numeric pixels, and identify halfSize as a center point of panel
  const normalizedDimensions = normalizeDimensionsAsPixels(initialDimensions, transformContext);
  const initialHalfSize = { 
      halfWidth: Math.round(normalizedDimensions.width / 2),
      halfHeight: Math.round(normalizedDimensions.height / 2),
  }

  const normalizedOrigin = normalizePostionAsPixels(firstPosition, transformContext)
  const normalizedOffset = normalizeOffsetAsPixels(offsetFromPrevious, transformContext)

  const maxVerticalTiles = Math.floor((window.innerHeight - normalizedOrigin.top) / (normalizedDimensions.height + normalizedOffset.vertical))
  const maxHorizontalTiles = Math.floor((window.innerWidth - normalizedOrigin.left) / (normalizedDimensions.width + normalizedOffset.horizontal))

  const normalizedVerticalMultiplier = maxVerticalTiles > 0 ? Math.floor(slotIndex / maxHorizontalTiles) % maxVerticalTiles : slotIndex
  const normalizedHorizontalMultiplier = maxHorizontalTiles > 0 ? slotIndex % maxHorizontalTiles : slotIndex

  return { 
    slotIndex,
    position: { 
      top: `${normalizedOrigin.top + initialHalfSize.halfHeight + (normalizedDimensions.height + normalizedOffset.vertical) * normalizedVerticalMultiplier}px`,
      left: `${normalizedOrigin.left + initialHalfSize.halfWidth + (normalizedDimensions.width + normalizedOffset.horizontal) * normalizedHorizontalMultiplier}px`
    }
  }
}

export function staggerInitialPanelPosition(panelDiv: HTMLDivElement, groupId: string, staggerStrategy: StaggerStrategy, initialDimensions: Dimensions) {
  let occupiedStaggerSlots:StaggerSlot[] = [];
  // find top position of all the modeless panels in our group
  document.querySelectorAll('.grid-panel.modal, .grid-panel.modeless').forEach(el => {
      const div: any = el as any
      if (div.groupId === groupId) {
          occupiedStaggerSlots.push(div.staggerSlot);
      }
  })

    // get the first unoccupied stagger slot - allows us to open in a locaiton where a previously opened panel closed
  const occupiedCount = occupiedStaggerSlots.length
  const sortedSlots = occupiedStaggerSlots.sort((s1, s2) => s1.slotIndex - s2.slotIndex);
  const openSlot = sortedSlots.findIndex((s, i) => s.slotIndex !== i);
  const targetSlotIndex = openSlot >= 0 ? openSlot : occupiedCount;
  
  const transformContext = {
      percent: { height: window.innerHeight, width: window.innerWidth },
      em: { height: Math.round(panelDiv.clientHeight), width: Math.round(panelDiv.clientWidth) }
  }

  const firstPosition = staggerStrategy.firstPosition ? staggerStrategy.firstPosition : { top: '50%', left: '50%' }
  const offsetFromPrevious = staggerStrategy.offsetFromPrevious ? staggerStrategy.offsetFromPrevious : { vertical: '50px', horizontal: '50px' }

  let staggerSlot:StaggerSlot
  if (staggerStrategy.algorithm === 'diagonal') {
    staggerSlot = getDiagonalStaggerSlot(targetSlotIndex, firstPosition, offsetFromPrevious, initialDimensions, transformContext)
  } else if (staggerStrategy.algorithm === 'tiled') {
    staggerSlot = getTiledStaggerSlot(targetSlotIndex, firstPosition, offsetFromPrevious, initialDimensions, transformContext)
  } else {
    // default to diagonal algorithm
    staggerSlot = getDiagonalStaggerSlot(targetSlotIndex, firstPosition, offsetFromPrevious, initialDimensions, transformContext)
  }

  const staggerDiv = panelDiv as any
  staggerDiv.groupId = groupId
  staggerDiv.staggerSlot = staggerSlot
  staggerDiv.style.setProperty('--top', staggerSlot.position.top);
  staggerDiv.style.setProperty('--left', staggerSlot.position.left);
}