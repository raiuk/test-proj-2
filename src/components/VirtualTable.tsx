import React from 'react'
import { useState, useRef, useContext } from 'react'
import { FixedSizeList, FixedSizeListProps } from 'react-window'
import { Option } from './Option'
import CreatableOptionSelect from './CreatableOptionSelect'

const CustomOption = ({index, levelIndex, optionsArr, option}: CustomOptionProps) => {
  const { setFirstLevelOption, triggerDataUpdate } = useContext(VirtualTableContext)
  const parentOption = levelIndex > 0 ? optionsArr[levelIndex - 1] : null
  const [isShown, setIsShown] = useState(false)

  const handleMouseOver = () => {
    setIsShown(true)
  }

  const handleMouseOut = () => {
    setIsShown(false)
  }

  return (
    <td
      className='cell'
      key={`${index}-cell-${levelIndex}`}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      style={isShown ? {padding: 0} : {padding: '10px'}}
    >
      {
        isShown ?
          <CreatableOptionSelect
            key={`${index}-${levelIndex}`}
            options={[parentOption?.generateChildId() ?? option?.id ?? '']}
            onChangeCallback={(_, value: string) => {
              if (value === '') {
                option?.removeOption()

                levelIndex === 0 && setFirstLevelOption(index, null) //only for level 1
              }
              else {
                const newValue = value.search('Add - ') !== -1
                  ? `${levelIndex + 1}.${value.split(' - ')[1]}`
                  : value

                levelIndex === 0 && setFirstLevelOption(
                  index,
                  new Option(
                    newValue,
                    parentOption,
                    null
                  )
                )
                levelIndex !== 0 && parentOption?.addChild(new Option(newValue, parentOption, null) )
              }
              triggerDataUpdate()
            }}
            value={option?.id ?? ''}
          /> :
          <span key={`${index}-${levelIndex}`}>{option?.id ?? ''}</span>
      }
    </td>
  )
}

const VirtualTableContext = React.createContext<{
  top: number
  setTop: (top: number) => void
  header: React.ReactNode
  tableData: Record<string, Option>
  setFirstLevelOption: (rowId: number, option: Option | null) => void
  triggerDataUpdate: () => void
}>({
  top: 0,
  setTop: (value: number) => {},
  header: <></>,
  tableData: {},
  setFirstLevelOption: () => {},
  triggerDataUpdate: () => {},
})


const VirtualTable = ({
  row,
  header,
  tableData,
  setFirstLevelOption,
  triggerDataUpdate,
...rest
}: {
  header?: React.ReactNode
  row: FixedSizeListProps['children']
  tableData: Record<string, Option>
  setFirstLevelOption: (rowId: number, option: Option | null) => void
  triggerDataUpdate: () => void
} & Omit<FixedSizeListProps, 'children' | 'innerElementType'>) => {
  const listRef = useRef<FixedSizeList | null>()
  const [top, setTop] = useState(0)

  return (
    <VirtualTableContext.Provider value={{ top, setTop, header, tableData, setFirstLevelOption, triggerDataUpdate }}>
      <FixedSizeList
        {...rest}
        innerElementType={Inner}
        initialScrollOffset={50}
        overscanCount={0}
        onItemsRendered={props => {
          const style =
            listRef.current &&
            // @ts-ignore private method access
            listRef.current._getItemStyle(props.overscanStartIndex)
          setTop((style && style?.top) || 0)

          rest.onItemsRendered && rest.onItemsRendered(props)
        }}
        ref={el => (listRef.current = el)}
      >
        {row}
      </FixedSizeList>
    </VirtualTableContext.Provider>
  )
}

const Row = ({ index }: { index: number }) => {
  const { tableData } = useContext(VirtualTableContext)
  const optionLevels: Array<Option | null> = tableData[index]?.getAllChildren() ?? []
  while (optionLevels.length < 5) { optionLevels.push(null) }
  const optionsMap = optionLevels.map((option, levelIndex, optionsArr) =>
      <CustomOption
        index={index}
        option={option}
        optionsArr={optionsArr}
        levelIndex={levelIndex}
      />
  )
  return (
    <tr key={index} style={{ height: '40px' }}>
        <td className='id-cell'>{index}</td>
        {optionsMap}
    </tr>
  )
}

const Inner = React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
  function Inner({ children, ...rest }, ref) {
    const { header, top } = useContext(VirtualTableContext)
    return (
      <div {...rest} ref={ref}>
        <table style={{ top, position: 'relative', width: '100%' }}>
          {header}
          <tbody>{children}</tbody>
        </table>
      </div>
    )
  }
)

const VTable = ({ rowsCount, tableData, setFirstLevelOption, triggerDataUpdate }: VTableProps): React.ReactElement => (
  <VirtualTable
    height={600}
    width="100%"
    itemCount={rowsCount}
    itemSize={40}
    header={
      <thead>
        <tr key='table-header' style={{ height: '40px' }}>
          <th className='id-cell'></th>
          <th className='cell'>Уровень 1</th>
          <th className='cell'>Уровень 2</th>
          <th className='cell'>Уровень 3</th>
          <th className='cell'>Уровень 4</th>
          <th className='cell'>Уровень 5</th>
        </tr>
      </thead>
    }
    row={Row}
    tableData={tableData}
    setFirstLevelOption={setFirstLevelOption}
    triggerDataUpdate={triggerDataUpdate}
  />
)

interface VTableProps {
  rowsCount: number
  tableData: Record<string, Option>
  setFirstLevelOption: (rowId: number, option: Option | null) => void
  triggerDataUpdate: () => void
}

interface CustomOptionProps {
  index: number
  levelIndex: number
  optionsArr: Array<Option | null>
  option: Option | null
}

export default VTable
