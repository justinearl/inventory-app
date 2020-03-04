document.addEventListener("DOMContentLoaded", function() {
  let app = firebase.app();
  let db = app.firestore();
  let table = document.getElementById("tbody");
  let idAdd = document.getElementById("id");
  let itemAdd = document.getElementById("item");
  let countAdd = document.getElementById("count");
  let authorAdd = document.getElementById("author");
  let conditionAdd = document.getElementById("condition");
  let addBtn = document.getElementById("addBtn");
  let searchBtn = document.getElementById("searchBtn");
  let searchInput = document.getElementById("searchInput");
  let searchBody = document.getElementById("searchResultBody");

  searchBtn.onclick = () => {
    db.collection("inventory")
      .where("item", "==", searchInput.value)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          let x = document.createElement("tr");
          let a = document.createElement("td");
          let b = document.createElement("td");
          let c = document.createElement("td");
          let d = document.createElement("td");
          let e = document.createElement("td");
          let f = document.createElement("td");

          a.innerHTML = doc.data().id;
          b.innerHTML = doc.data().item;
          c.innerHTML = doc.data().count;
          d.innerHTML = doc.data().author;
          e.innerHTML = doc.data().date;
          f.innerHTML = doc.data().condition;

          x.appendChild(a);
          x.appendChild(b);
          x.appendChild(c);
          x.appendChild(e);
          x.appendChild(d);
          x.appendChild(f);
          searchBody.appendChild(x);
          document.getElementById("searchResult").style.display = "block";
        });
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
  };

  let dispItem = (realID, id, item, count, date, author, condition) => {
    let newRow = document.createElement("tr");
    let newID = document.createElement("td");
    newID.innerHTML = id;
    let newItem = document.createElement("td");
    newItem.innerHTML = item;
    let newCount = document.createElement("td");
    newCount.innerHTML = count;
    let newDate = document.createElement("td");
    newDate.innerHTML = date;
    let newAuthor = document.createElement("td");
    newAuthor.innerHTML = author;
    let newCondition = document.createElement("td");
    newCondition.innerHTML = condition;
    let funct = document.createElement("td");
    let f1 = document.createElement("button");
    f1.innerHTML = "Edit";
    let f2 = document.createElement("button");
    f2.innerHTML = "Delete";

    f1.onclick = () => {
      newID.contentEditable = "true";
      newItem.contentEditable = "true";
      newCount.contentEditable = "true";
      newAuthor.contentEditable = "true";
      newCondition.contentEditable = "true";
      newID.style.background = "white";
      newItem.style.background = "white";
      newCount.style.background = "white";
      newAuthor.style.background = "white";
      newCondition.style.background = "white";

      f1.style.display = "none";
      f2.style.display = "none";
      let j = document.createElement("button");
      j.innerHTML = "Save";
      funct.appendChild(j);
      j.onclick = () => {
        let updateID = newID.firstChild.nodeValue
          ? newID.firstChild.nodeValue
          : "0";
        let updateItem = newItem.firstChild.nodeValue
          ? newItem.firstChild.nodeValue
          : "0";
        let updateCount = newCount.firstChild.nodeValue
          ? newCount.firstChild.nodeValue
          : "0";
        let updateAuthor = newAuthor.firstChild.nodeValue
          ? newAuthor.firstChild.nodeValue
          : "0";
        let updateCondition = newCondition.firstChild.nodeValue
          ? newCondition.firstChild.nodeValue
          : "0";
        db.collection("inventory")
          .doc(realID)
          .update({
            id: updateID,
            item: updateItem,
            count: updateCount,
            author: updateAuthor,
            condition: updateCondition,
            dateCreated: new Date().getTime()
          });
        f1.style.display = "block";
        f2.style.display = "block";
        loadData();
      };
    };

    f2.onclick = () => {
      console.log("Deleted " + realID);
      db.collection("inventory")
        .doc(realID)
        .delete()
        .then(() => {
          table.removeChild(newRow);
        });
    };

    newRow.appendChild(newID);
    newRow.appendChild(newItem);
    newRow.appendChild(newCount);
    newRow.appendChild(newDate);
    newRow.appendChild(newAuthor);
    newRow.appendChild(newCondition);
    funct.appendChild(f1);
    funct.appendChild(f2);
    newRow.appendChild(funct);
    table.appendChild(newRow);
  };

  db.collection("inventory")
    .orderBy("dateCreated")
    .onSnapshot(function(querySnapshot) {
      table.innerHTML = "";
      querySnapshot.forEach(doc => {
        var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
        if (source == "Server") {
          dispItem(
            doc.id,
            doc.data().id,
            doc.data().item,
            doc.data().count,
            doc.data().date,
            doc.data().author,
            doc.data().condition
          );
        }
      });
    });

  let addItem = (id, item, count, author, condition) => {
    addBtn.innerHTML = "Adding ...";
    addBtn.disabled = true;

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0");
    let yyyy = today.getFullYear();
    let hr = today.getHours();
    let min = today.getMinutes();
    let sec = today.getSeconds();

    let currentDate =
      mm + "/" + dd + "/" + yyyy + "  " + hr + ":" + min + ":" + sec;

    db.collection("inventory").add({
      id: id,
      item: item,
      count: count,
      dateCreated: new Date().getTime(),
      author: author,
      condition: condition,
      date: currentDate
    });
    addBtn.innerHTML = "Add Item";
    addBtn.disabled = false;
  };

  addBtn.onclick = () => {
    addItem(
      idAdd.value,
      itemAdd.value,
      countAdd.value,
      authorAdd.value,
      conditionAdd.value
    );

    idAdd.value = "";
    itemAdd.value = "";
    countAdd.value = "";
    authorAdd.value = "";
    conditionAdd.value = "";

    loadData();
  };

  let loadData = () => {
    db.collection("inventory")
      .orderBy("dateCreated")
      .get()
      .then(function(querySnapshot) {
        table.innerHTML = "";
        querySnapshot.forEach(doc => {
          dispItem(
            doc.id,
            doc.data().id,
            doc.data().item,
            doc.data().count,
            doc.data().date,
            doc.data().author,
            doc.data().condition
          );
        });
      });
  };
});
