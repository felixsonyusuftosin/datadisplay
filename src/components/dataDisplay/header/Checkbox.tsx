import React, { useState } from 'react'

type CheckboxChangeType = {
  checked: boolean
  name?: string
  id?: number
}
type CheckboxProps = {
  checked?: boolean
  onChange?: (item: CheckboxChangeType) => void
  name?: string
  id?: number
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  ...props
}) => {
  const [isChecked, setIsChecked] = useState(checked)

  const handleChange = () => {
    props.onChange &&
      props.onChange({ name: props.name, id: props.id, checked: !isChecked })
    setIsChecked(!isChecked)
  }

  const className = isChecked ? 'checkbox-selected' : 'checkbox'
  console.log(isChecked, className, ' ===>')
  return (
    <div onClick={handleChange} className='checkbox-container'>
      <div className={className} />
    </div>
  )
}

export default Checkbox