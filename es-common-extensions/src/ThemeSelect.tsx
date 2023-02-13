import React from 'react'

const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g><path d="M0,0h24v24H0V0z" fill="none"/><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></g></svg>
const DarkModeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect fill="none" height="24" width="24"/><path d="M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36c-0.98,1.37-2.58,2.26-4.4,2.26 c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z"/></svg>
const LightModeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect fill="none" height="24" width="24"/><path d="M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0 c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2 c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1 C11.45,19,11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06 c0.39,0.39,1.03,0.39,1.41,0s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41 l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41 c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36 c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z"/></svg>

export const ThemeSelect: React.FC<{container: HTMLElement}> = ({ container }) => {
  const [theme, setTheme] = React.useState<'Dark' | 'Light'>('Dark')

  React.useEffect(() => {
    if (theme === 'Dark') {
      container.classList.remove('light')
    } else {
      container.classList.add('light')
    }
  }, [theme])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const dropdown: any = e.target.closest('es-ribbon-dropdown')
    setTheme(e.target.value as any)
    dropdown?.close() // or close depending on what you want
  }
  function whenTheme<T>(t: string, use: T, def?: T) {
    return theme === t ? use : def
  }
  return <es-ribbon-section label="Theme">
    <div style={{ display: 'flex', flexDirection: "column", alignItems: 'flex-start'}}>
      <style>{/*css*/`
      .theme-indicator.active {
        display: block;
      }
      .theme-indicator {
        display: none;
      }
      `}</style>
      <es-ribbon-button-small style={{justifyContent: 'start'}}>
        <div className={`theme-indicator ${whenTheme('Dark', 'active')}`}>
          <DarkModeIcon/>
        </div>
        <div className={`theme-indicator ${whenTheme('Light', 'active')}`}>
          <LightModeIcon/>
        </div>
        <label>{theme}</label>

        <es-ribbon-dropdown>
          <es-ribbon-dropdown-item onClick={() => setTheme('Dark')}>
            <DarkModeIcon/><label>Dark</label>
          </es-ribbon-dropdown-item>
          <es-ribbon-dropdown-item onClick={() => setTheme('Light')}>
            <LightModeIcon/><label>Light</label>
          </es-ribbon-dropdown-item>
        </es-ribbon-dropdown>
      </es-ribbon-button-small>

      <es-ribbon-button-small label="Radio Example">
        <SettingsIcon/>
        <es-ribbon-dropdown>
          <es-ribbon-dropdown-item>
            <label>
              <input value="Dark" type="radio" name="pick-theme" onChange={handleChange} checked={whenTheme('Dark', true, false)}></input>Dark
            </label>
          </es-ribbon-dropdown-item>
          <es-ribbon-dropdown-item>
            <label>
              <input value="Light" type="radio" name="pick-theme" onChange={handleChange} checked={whenTheme('Light', true, false)}></input>Light
            </label>
          </es-ribbon-dropdown-item>
        </es-ribbon-dropdown>
      </es-ribbon-button-small>

      <select name="theme" onChange={handleChange} value={theme}>
        <option value="Dark">Dark</option>
        <option value="Light">Light</option>
      </select>
    </div>
  </es-ribbon-section>
}
