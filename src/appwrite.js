import { Client, Databases, ID, Query } from 'appwrite'


const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(PROJECT_ID)

const database = new Databases(client)

export const updateSearchCount = async (searchTerm, movie) => {
  // 1. use Appwrite SDK to check if the serach term exists in Database.
  try{
    const result = database.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.equal('searchTerm',searchTerm)])

    // 2. if it does, simply update the count.
    if(result.documnets.length  > 0){
      const doc = result.documnets[0];

      await database.updateDocument(DATABASE_ID, COLLECTION_ID, {
        count: doc.count + 1,
      })
    // 3. it if does not, create a new document with the search term and count as 1.
    }else{
      await database.createDocument(DATABASE_ID,COLLECTION_ID, ID.unique(),{
        searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      })
    }
  }
  catch (error){
    console.log(error);
    
  } 
  
}

