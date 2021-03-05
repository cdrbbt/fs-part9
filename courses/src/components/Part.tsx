import React from 'react';
import { CoursePart } from '../types';

const Part = ({ coursePart }: {coursePart: CoursePart }) => {

  const notCourse = (value: never):never => {
    throw new Error(`Couldnt parse as course: ${value}`)
  }

  const header = <h3>{`${coursePart.name} ${coursePart.exerciseCount}`}</h3>

  let body

  switch(coursePart.type){
    case 'groupProject':{
      body = <div>
        group project excercises: {coursePart.groupProjectCount}
      </div>
      break
    }
    case 'normal':{
      body = <div>
        {coursePart.description}
      </div>
      break
    }
    case 'submission': {
      body = <div>
        {coursePart.description}<br/>
        submit to {coursePart.exerciseSubmissionLink}
      </div>
      break
    }
    case 'special': {
      body = <div>
        {coursePart.description}<br/>
        required skills: {coursePart.requirements.join(', ')}
      </div>
      break
    }
    default: notCourse(coursePart)
  }
  return <div>
    {header}
    {body}
  </div>
}

export default Part;