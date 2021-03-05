import  React  from 'react';
import { CoursePart } from '../types';
import Part from './Part'

const Content = ({ courseParts }:{courseParts:CoursePart[]}) => {
  return (
    <>
    {courseParts.map(part => 
      <Part coursePart={part} key={part.name} />
      )}
    </>
  )
}

export default Content