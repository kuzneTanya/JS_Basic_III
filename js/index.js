// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const cancelButton = document.querySelector('.cancel__btn'); // кнопка сброса фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

/*** ОТОБРАЖЕНИЕ ***/

// генерация hex кода из строки
function stringToHexColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return '#' + ((hash & 0xFFFFFF).toString(16).padStart(6, '0'));
}

// отрисовка карточек
const display = () => {
  fruitItems = document.querySelectorAll('.fruit__item');
  fruitItems.forEach(item => {
    fruitsList.removeChild(item); 
  });

  for (let i = 0; i < fruits.length; i++) {
    let fruit = document.createElement('li');
    fruit.className = "fruit__item";
    fruit.innerHTML = `<div class="fruit__info">
                        <div>Номер: `+(i+1)+`</div>
                        <div>Вид: `+fruits[i].kind+`</div>
                        <div>Цвет: `+fruits[i].color+`</div>
                        <div>Вес (кг): `+fruits[i].weight+`</div>
                       </div>`;
    // выбор цвета в зависимости от названия
    /*let color = () => {switch(fruits[i].color){
      case "фиолетовый": return "violet"; break;
      case "зеленый": return "green"; break;
      case "розово-красный": return "carmazin"; break;
      case "желтый": return "yellow"; break;
      case "светло-коричневый": return "lightbrown"; break;
      default: return "black";
    }};
    fruit.className += " fruit_"+color();*/

    // выбор цвета с помощью генерации hex кода из строки
    fruit.style = 'border: 10px, solid, ' + stringToHexColor(fruits[i].color);
    fruitsList.appendChild(fruit);
  }
};

// первая отрисовка карточек
display();

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  let result = [];
  let oldFruits = [];
  let compareResult = [];
  fruits.forEach(el => {
    oldFruits.push(el);
  });
  let i = 0;
  while (fruits.length > 0) {
    i = getRandomInt(0, fruits.length-1);
    result.push(fruits[i]);
    fruits.splice(i, 1);
  };
  for(i = 0; i < result.length; i++) {
    if (result[i].kind === oldFruits[i].kind) {
      compareResult.push(true);
    }
    else compareResult.push(false);
  };
  if (compareResult.every((el) => el === true)) alert('Порядок не изменился');
  fruits = result;
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
    fruits = fruits.filter((item) => {
    const weight = item.weight;
    let minWeight = document.querySelector('.minweight__input').value;
    let maxWeight = document.querySelector('.maxweight__input').value;
    return weight >= minWeight && weight <= maxWeight;
  });
  return fruits;
};


filterButton.addEventListener('click', () => {
  filterFruits();
  console.log(filterFruits());
  display();
});

cancelButton.addEventListener('click', () => {
  fruits = JSON.parse(fruitsJSON);
  display();
})

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {
  return a.color[0] > b.color[0] ? true : false;
};

const sortAPI = {
  bubbleSort(arr, comparation) {
    const n = arr.length;
    for (let i = 0; i < n-1; i++) {
        for (let j = 0; j < n-1-i; j++) {
            if (comparation(arr[j], arr[j+1])) {
              [arr[j], arr[j+1]] = [arr[j+1], arr[j]]
            }
        }
    }
  },

  partition(arr, comparation, left, right, pivot) {
    let l = left, r = right;
      while (l <= r) {
        while (comparation(pivot, arr[l])) {
          l++;
        }
        while (comparation(arr[r], pivot)) {
          r--;
        }
        if (l <= r) {
          [arr[l], arr[r]] = [arr[r], arr[l]];
          l++;
          r--;
        }
      }
      return l;
  },

  quickSort(arr, comparation, left = 0, right = arr.length - 1) {
    if (arr.length <= 1) return arr; 
    let pivot = arr[Math.floor((left + right)/2)];
    index = sortAPI.partition(arr, comparation, left, right, pivot);
    console.log('left = ' + left + ', right = ' + right + 'index = ' + index);
    if (left < index - 1) {
      sortAPI.quickSort(arr, comparation, left, index - 1);
    }
    if (index < right) {
      sortAPI.quickSort(arr, comparation, index, right);
    }
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  sortKind = sortKind === 'bubbleSort' ? 'quickSort' : 'bubbleSort';
  sortKindLabel.textContent = sortKind;
});

sortActionButton.addEventListener('click', () => {
  sortTimeLabel.textContent = 'sorting...';
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  display();
  sortTimeLabel.textContent = sortTime;
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  if (kindInput.value && colorInput.value && weightInput.value) {
    fruits.push({"kind": kindInput.value, "color": colorInput.value, "weight": weightInput.value});
    display();
  } else alert('Введите все значения');  
});
