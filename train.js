window.onload = function() {

var config = {
  apiKey: "AIzaSyCL8gMNlkospOu2qlY-XZ5lcQNi13xEthw",
  authDomain: "trainscheduler2-71460.firebaseapp.com",
  databaseURL: "https://trainscheduler2-71460.firebaseio.com",
  projectId: "trainscheduler2-71460",
  storageBucket: "trainscheduler2-71460.appspot.com",
  messagingSenderId: "341082650139"
};

firebase.initializeApp(config);

var dataRef = firebase.database();

  
      // Initial Values
      var name = "";
      var destination = "";
      var startTime = "";
      var frequency = 0;
  
      // Capture button click
      document.querySelector("#submit").addEventListener("click", function(event) {
        event.preventDefault();
  
        // values from text boxes
        name = document.querySelector("#trainName").value.trim();
        destination = document.querySelector("#destination").value.trim();
        startTime = document.querySelector("#time").value.trim();
        frequency = document.querySelector("#frequency").value.trim();
  
        // Code for handling the push
        dataRef.ref().push({
          name: name,
          destination: destination,
          frequency: frequency,
          startTime:startTime,
          timeAdded: firebase.database.ServerValue.TIMESTAMP
        });
  
      });
  
      // Firebase watcher .on("child_added"
      dataRef.ref().on("child_added", function(childSnapshot) {

      //get next train time/minutes 
        var startTime = moment(childSnapshot.val().startTime, "hh:mm").subtract(1, "years");
        var timeDif = moment().diff(moment(startTime), "minutes");
        var timeLeft = timeDif % childSnapshot.val().frequency;
        var minUntilArrival = childSnapshot.val().frequency - timeLeft;
        var nextTrain = moment().add(minUntilArrival, "minutes");

      //create table to display values   

          let parent = document.querySelector("#currTrain");
          let tableRow = document.createElement("tr");
          let nameEl = document.createElement("td");
          nameEl.innerText = childSnapshot.val().name;
          tableRow.appendChild(nameEl);
          
          let destinationEl = document.createElement("td");
          destinationEl.innerText = childSnapshot.val().destination;
          tableRow.appendChild(destinationEl);
          
          let frequencyEl = document.createElement("td");
          frequencyEl.innerText = childSnapshot.val().frequency;
          tableRow.appendChild(frequencyEl);
          
          let nextArrivalEl= document.createElement("td");
          nextArrivalEl.innerText = moment(nextTrain).format("LT");
          tableRow.appendChild(nextArrivalEl)
          
          let minUntilArrivalEl = document.createElement("td");
          minUntilArrivalEl.innerText = minUntilArrival;
          tableRow.appendChild(minUntilArrivalEl)
          parent.appendChild(tableRow); 
               
        
        
  
        // Handle the errors
      }, function(errorObject) {
        console.log(`Errors handled: ${errorObject.code}`);
      });
    }
  
