import React, {useState} from 'react';
import  socket  from "./Socket";
const UserScreen = () => {

    const [number, setNumber] = useState("");

        const handleChange = (e) => {
            const value = e.target.value;
            if (value === "" || (value >= 1 && value <= 5)) {
              setNumber(value);
            }
        };

        const handleSubmit = (e) => {
          e.preventDefault();
          
          socket.emit("addScore", {
            score: Number(number),
          });

          console.log("Data Sent");

          setNumber("");
        };

    return (<div style={{ padding: "20px" }}>
      <h2>Enter Number (1-5)</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          min="1"
          max="5"
          value={number}
          onChange={handleChange}
          placeholder="Enter 1 to 5"
        />

        <button type="submit"  style={{ marginLeft: "10px" }}>
          Submit
        </button>
      </form>
    </div>)

}

export default UserScreen;