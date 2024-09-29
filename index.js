import bodyParser from "body-parser";
import pg from "pg"
import express from "express"
import axios from "axios";

const port = 3000
const app = express()
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Anime",
  password: "shawarma",
  port: 5432
});




//middleware
db.connect()
app.use(express.static("public"))


app.get("/", async (req, res) => {
  const animeData = await checkAnimes()
  let data = []
  // animeData[1].forEach(anime => {
  //   const result = new AnimeFormat(anime);
  //   data.push(result)
  // });
  for (let i = 0; i < animeData[0].length; i ++) {
    const result = new AnimeFormat (animeData[0][i], animeData[1][i])
    data.push(result)
  }
  console.log(data)
  res.render("index.ejs", {data: data})
})

app.listen(port, () => {
  console.log(`Server currently listening on port ${port}`)
})

async function checkAnimes () {
  try {
    const dbResponse = await db.query("select * from animes order by id asc");
    const dbResult = dbResponse.rows;
    let animeDetails = [];
    for await (let anime of dbResult) {
      const response = await axios.get("https://api.jikan.moe/v4/anime/" + anime.api_id)
      const result = response.data.data
      animeDetails.push(result)
      setTimeout(() => {}, 500)
    };
    return [animeDetails, dbResult]
    } catch (err) {
      console.log(err.message)
    }
  

}

function AnimeFormat (x, y) {
  this.image_url = x.images.jpg.image_url;
  this.url = x.url;
  this.score = x.score;
  this.studio = x.studios[0].name;
  this.status = x.status;
  this.title = x.titles[0].title;
  this.review = y.review;
  this.rating = y.rating;

}






