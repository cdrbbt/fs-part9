import  React  from 'react';

const Content:React.FC<{courseParts:{name: string, excerciseCount: number}[]}> = ({courseParts}) => {
  return (
    <>
    {courseParts.map(part => 
      <p key={part.name}>{part.name} {part.excerciseCount}</p>
      )}
    </>
  )
}

export default Content