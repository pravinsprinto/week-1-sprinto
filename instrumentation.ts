
// const ca = fs.readFileSync('us-east-1-bundle.pem', 'utf8').toString()

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { connectDB,syncDB } = require('./lib/sequelize')
    const { dbConnect } = require('./lib/mongoose')
    await connectDB()
    await dbConnect()
    await syncDB()
  }

}