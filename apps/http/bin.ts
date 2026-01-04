import { app } from ".";

const PORT = process.env.PORT;

app.listen(PORT, () => console.log("code is running at ", PORT));