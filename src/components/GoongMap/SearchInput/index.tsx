import { Input, InputProps } from 'antd-mobile'
import { FC } from 'react'

type SearchInputProps = InputProps

const SearchInput: FC<SearchInputProps> = (props) => {
  const { style = { '--font-size': 'var(--adm-font-size-5)' }, ...rest } = props
  return <Input {...rest} clearable style={style} />
}

export default SearchInput
