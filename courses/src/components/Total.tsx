import React from 'react'

const Total:React.FC<{courseParts:{name: string, excerciseCount: number}[]}> = ({ courseParts }) => {
  return (
    <p>
      Number of excercises{" "}
      {courseParts.reduce((acc, val) => acc + val.excerciseCount, 0)}
    </p>
  )
}

export default Total