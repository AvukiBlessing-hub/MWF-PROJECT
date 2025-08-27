function sendMessage() {
  const msg = document.getElementById("messageBox").value;
  const recipient = document.getElementById("recipient").value;

  if (msg.trim() === "") {
    alert("Please enter a message.");
    return;
  }

  if (recipient === "all") {
    // Send to all employees
    document.querySelectorAll(".card .message").forEach(box => {
      box.style.display = "block";
      box.innerText = "Manager says: " + msg;
    });
  } else {
    // Send only to selected person
    const card = document.querySelector(`.card[data-name='${recipient}'] .message`);
    if (card) {
      card.style.display = "block";
      card.innerText = "Manager says: " + msg;
    }
  }

  document.getElementById("messageBox").value = "";
}
