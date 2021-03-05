import React from 'react'
import { CoursePart } from '../types'

const Total = ({ courseParts }: { courseParts: CoursePart[] }) => {
  return (
    <p>
      Number of excercises{" "}
      {courseParts.reduce((acc, val) => acc + val.exerciseCount, 0)}
    </p>
  )
}

export default Total