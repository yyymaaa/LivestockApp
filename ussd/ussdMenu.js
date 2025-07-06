const sessions = {};

module.exports = (req, res) => {
  const { sessionId, phoneNumber, text } = req.body;

  const input = text.split("*");
  const step = input.length;

  let response = "";

  // Step 1: Main Menu
  if (text === "") {
    response = `CON Welcome to Livestock Services
1. Add Product
2. View My Listings
3. Find Services Near Me
4. Contact Provider`;

  // Step 2: Add Product Flow
  } else if (input[0] === "1") {
    switch (step) {
      case 1:
        response = "CON Enter product title:";
        break;
      case 2:
        response = "CON Enter product description:";
        break;
      case 3:
        response = "CON Enter price (e.g., 5000):";
        break;
      case 4:
        response = "CON Enter quantity available:";
        break;
      case 5:
        // Here you'd save to DB using:
        // input[1] = title
        // input[2] = description
        // input[3] = price
        // input[4] = quantity

        // For now, simulate saving
        response = `END Product "${input[1]}" added successfully!`;
        break;
      default:
        response = "END Invalid entry. Please try again.";
    }

  // Step 2: View Listings
  } else if (input[0] === "2") {
    // Replace with actual DB lookup later
    response = `END Your Listings:\n1. Cow Ghee - 30 jars\n2. Goats - 10 available`;

  // Step 3: Find Nearby Services
  } else if (input[0] === "3") {
    // Replace with geolocation filter later
    response = `END Nearby Services:\n- Vet: Kiama Vet, Ksh 1500\n- Cattle Dip: Ngong Dips, Ksh 2000`;

  // Step 4: Contact Provider
  } else if (input[0] === "4") {
    response = `END Call 0712345678 to reach a local vet provider.`;

  } else {
    response = "END Invalid option. Try again.";
  }

  res.set("Content-Type", "text/plain");
  res.send(response);
};
