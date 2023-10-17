import React, {useCallback, useState} from 'react'
import './Table.css'
import plusIcon from '../assets/plus-icon.svg'
import VTable from "./VirtualTable"
import {Option} from './Option'

const initialOption = new Option('1.1',  null, null)

initialOption.addChild(new Option('2.1',  null, null))

const allOptions: Record<number, Option> = {
  0: initialOption
}

const Table: React.FC = () => {
  const [tableData, setTableData] = useState<Record<number, Option>>(allOptions)
  const [rowsCount, setRowsCount] = useState(1)
  const [inputValue, setInputValue] = useState(100000)
  const forceUpdate = useForceUpdate()

  const setFirstLevelOption = useCallback((rowId: number, option: Option | null) => {
    setTableData(data => {
      if (option) {
        return {
          ...data,
          [rowId]: option,
        }
      }
      else {
        delete data[rowId]
        return {
          ...data
        }
      }

    })

  }, [setTableData])

  const triggerDataUpdate= useCallback(() => {
    forceUpdate()
  }, [forceUpdate])

  const handleAddRow = () => {
    setRowsCount(rowsCount => rowsCount + Math.abs(inputValue))
  }

  const handleSave = () => {
    console.log('tableData:')
    for (const option of Object.values(tableData)) {
      console.log(option.getAllChildren())
    }
  }

  return (
    <div className='table-wrapper'>
      <VTable
        rowsCount={rowsCount}
        tableData={tableData}
        setFirstLevelOption={setFirstLevelOption}
        triggerDataUpdate={triggerDataUpdate}
      />
      <div className='add-row-wrapper'>
        <button className='add-row' onClick={handleAddRow}>
          <img src={plusIcon} alt='plus-icon'/>
          <span>Добавить строку</span>
        </button>
        <input placeholder='100000' className='add-row' type='number' onChange={(event) => setInputValue(Number(event.target.value))}/>
      </div>
      <button className='save-btn' onClick={handleSave}>
        <span>Сохранить</span>
      </button>
    </div>
  )
}

function useForceUpdate() {
  const [, setToggle] = useState(false)
  return () => setToggle(toggle => !toggle)
}

export default Table
