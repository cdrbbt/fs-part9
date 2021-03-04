import React from 'react';
import Content from './components/Content';
import Header from './components/Header';
import Total from './components/Total';


const App: React.FC = () => {
  const courseName = "Half Stack application development";
  const courseParts = [
    {
      name: 'Fundamentals',
      excerciseCount: 10
    },
    {
      name: "Using props to pass data",
      excerciseCount: 7
    },
    {
      name: "Deeper type usage",
      excerciseCount: 14
    }
  ];

  return (
    <div>
      <Header courseName={courseName} />
      <Content courseParts={courseParts} />
      <Total courseParts={courseParts}/>
    </div>
  )
}


export default App;
