import React, { ChangeEvent } from 'react'

export const ThemeSelect: React.FC<{container: HTMLElement}> = ({ container }) => {
  const [theme, setTheme] = React.useState('dark')
  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    setTheme(e.target.value)
    if (e.target.value === 'dark') {
      container.classList.remove('light')
    } else {
      container.classList.add('light')
    }
  }
  return <label>
    Theme:
    <select name="theme" onChange={handleChange} value={theme}>
      <option value="dark">Dark</option>
      <option value="light">Light</option>
    </select></label>
}
