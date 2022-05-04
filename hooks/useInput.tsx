import { Input } from '@chakra-ui/react'
import React from 'react'
import { useState } from 'react'

interface Props {
  type: string
}

export const useInput = ({ type }: Props) => {
  const [value, setValue] = useState('')
  const input = (
    <Input value={value} onChange={(e) => setValue(e.target.value)} type={type} color={"white"}/>
  )
  return [value, input]
}
