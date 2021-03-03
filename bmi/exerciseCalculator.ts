interface ExercisesEvaluation {
  periodLenght: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number
}

interface ExInput{
  target: number;
  data: Array<number>
}

export const calculateExercises = (dailyData: Array<number>, target: number): ExercisesEvaluation => {
  const periodLenght = dailyData.length;
  const trainingDays = dailyData.filter(h => h !== 0).length;
  const average = dailyData.reduce((acc, val) => acc + val) / periodLenght;
  const success = average > target;
  let rating;

  const percent = average / target * 100;

console.log(percent);

  if (percent < 50) rating = 1;
  else if (percent < 100) rating = 2;
  else if (percent < 125) rating = 3;
  else if (percent < 150) rating = 4;
  else rating = 5;

  let ratingDescription;

  switch (rating) {
    case 1: {
      ratingDescription = 'need to excersice a lot more';
      break;
    }
    case 2: {
      ratingDescription = 'not too bad but could be better';
      break;
    }
    case 3: {
      ratingDescription = 'target met';
      break;
    }
    case 4: {
      ratingDescription = 'above target';
      break;
    }
    case 5: {
      ratingDescription = 'overperformed';
      break;
    }
    default: ratingDescription = 'somethign went wrong';
  }


  return {
    periodLenght,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
};

const parseArguments = (args: Array<string>): ExInput => {
  if (args.length < 4) throw new Error('not enoguh arguments');

  const numbers = args.slice(2).map(n => Number(n));

  if (numbers.some((n) => isNaN(n))) throw new Error('arguments must be numbers');

  return {
    target: numbers[0],
    data: numbers.slice(1)
  };
};

try {
  const {target, data} = parseArguments(process.argv);
  console.log(calculateExercises(data, target));
} catch (e) {
  if (e instanceof Error) {
    console.log('error', e.message);
  } else {
    console.log('error', e);
  }
}


