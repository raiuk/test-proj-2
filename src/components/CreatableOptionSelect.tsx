import * as React from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete'
import {SyntheticEvent} from "react"

const filter = createFilterOptions<string>()

const CreatableOptionSelect = (
  {options, onChangeCallback, value}: OptionSelectProps
): React.ReactElement => {

  return (
    <Autocomplete
      value={value}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      freeSolo
      options={options}
      sx={{ width: '100%' }}
      onChange={(event, newValue) => {
        onChangeCallback(event, newValue ?? '')
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params)

        const { inputValue } = params
        const isExisting = options.some((option) => inputValue === option)
        if (inputValue !== '' && !isExisting) {
          filtered.push(`Add - ${inputValue}`)
        }

        return filtered
      }}
      renderOption={(props, option) => <li {...props}>{option}</li>}
      renderInput={(params) => (
        <TextField  {...params} InputLabelProps={{shrink: false}} label='' />
      )}
    />
  )
}

interface OptionSelectProps {
  options: string[]
  onChangeCallback: (event: SyntheticEvent<Element, Event>, value: string) => void
  value: string
}

export default CreatableOptionSelect
