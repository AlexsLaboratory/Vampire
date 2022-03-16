google.charts.load("current", {"packages": ["corechart"]});

function drawChart(data_array) {
  let data = google.visualization.arrayToDataTable(data_array, true);

  let options = {
    "title": "Vampires vs Humans",
    "width": 400,
    "height": 300
  };

  let chart = new google.visualization.PieChart(document.getElementById("chart_div"));
  chart.draw(data, options);
}

function addPerson(event) {
  event.preventDefault();
  const form = document.getElementById("add-user-form");
  const nameInput = document.getElementById("name-input");
  const shadowCheck = document.getElementById("shadow-check");
  const complexionCheck = document.getElementById("complexion-check");
  const garlicCheck = document.getElementById("garlic-check");

  const name = nameInput.value;
  const shadow = shadowCheck.checked;
  const complexion = complexionCheck.checked;
  const garlic = garlicCheck.checked;

  const newPerson = {
    "name": name,
    "garlic": garlic,
    "complexion-pale": complexion,
    "shadow": shadow
  };
  model.addPerson(newPerson);
  populateTableRow(newPerson);
  google.charts.setOnLoadCallback(() => {
    drawChart(model.vampireCalc());
  });
  form.reset();
}

function populateTableRow(personObj) {
  let tableTbody = document.querySelector("#display-all-user-data>tbody")
  let newRow = tableTbody.insertRow();
  newRow.insertCell(0).append(personObj.name)
  newRow.insertCell(1).append(personObj.shadow)
  newRow.insertCell(2).append(personObj["complexion-pale"])
  newRow.insertCell(3).append(personObj.garlic)
  if (model.isVampire(personObj)) {
    newRow.style.backgroundColor = "#3366cc";
    newRow.style.color = "white";
  }
}

class Model {
  constructor() {
    this._data = {
      "people": [
        {
          "name": "Kent",
          "garlic": true,
          "complexion-pale": true,
          "shadow": false
        },
        {
          "name": "Bruce",
          "garlic": true,
          "complexion-pale": true,
          "shadow": true
        },
        {
          "name": "Peter",
          "garlic": true,
          "complexion-pale": true,
          "shadow": true
        },
      ]
    };
    this._logic = 1;
  }

  getAllPeople() {
    return this._data.people
  }

  addPerson(personObj) {
    this._data.people.push(personObj)
  }

  getPeopleLength() {
    return this._data.people.length
  }

  getLogic() {
    return this._logic;
  }

  setLogic(logic) {
    this._logic = logic;
  }

  vampireCalc() {
    let data = [["Vampire", 0], ["Human", 0]];
    Object.keys(this.getAllPeople()).forEach(key => {
      let personObj = this.getAllPeople()[key];
      if (this.isVampire(personObj)) {
        data[0][1]++;
      } else {
        data[1][1]++;
      }
    });
    return data;
  }

  isVampire(personObj) {
    if (this.getLogic() === 1) {
      let score = 0;
      if (!personObj.shadow) {
        score += 4;
      }
      if (personObj["complexion-pale"]) {
        score += 3;
      }
      if (!personObj.garlic) {
        score += 3;
      }
      return score > 6;
    } else {
      return propExists(personObj, "vampire") ? personObj.vampire : false;
    }
  }

  randomIndex() {
    return Math.floor(Math.random() * this.getPeopleLength());
  }

  randomVampire() {
    return this.getAllPeople()[this.randomIndex()];
  }
}

function propExists(personObj, prop) {
  return personObj[prop] !== undefined;
}

const model = new Model()

document.getElementById("model-logic").addEventListener("change", (e) => {
  model.setLogic(parseInt(e.target.value));
}, {passive: true})

function populateTable(model) {
  let tableTbody = document.querySelector("#display-all-user-data>tbody")
  tableTbody.innerHTML = "";

  if (model.getLogic() === 2) {
    // Object.keys(model.getAllPeople()).forEach(key => {
    //   if (propExists(model.getAllPeople()[key], "vampire") && model.getAllPeople()[key].vampire === true)
    //     delete model.getAllPeople()[key].vampire
    // });
    model.randomVampire().vampire = true;
  }

  Object.keys(model.getAllPeople()).forEach(key => {
    populateTableRow(model.getAllPeople()[key])
  });
}

function runModel(model) {
  populateTable(model);
  google.charts.setOnLoadCallback(() => {
    drawChart(model.vampireCalc());
  });
}

document.querySelector("button[type='submit']").addEventListener("click", addPerson);