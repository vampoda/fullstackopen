import { useState } from "react"
import {useMutation} from "@apollo/client"
import {CREATE_BOOK,ALL_BOOKS,ALL_AUTHORS} from "../query"
import { updateCache } from '../App'



    const NewBook = ({show, setError}) => {
        const [title, setTitle] = useState('')
        const [author, setAuthor] = useState('')
        const [published, setPublished] = useState('')
        const [genre, setGenre] = useState('')
        const [genres, setGenres] = useState([])

        const[createBook]=useMutation(CREATE_BOOK,{
            refetchQueries:[{query:ALL_AUTHORS}],
            onError:(error)=>{
                const message=error.graphQLErrors[0].message
                setError(message)
                console.log("error",message)
            },
            update:(cache,response)=>{
                updateCache(cache,{query:ALL_BOOKS},response.data.addBook)
            },
        })

if(!show){
    return null
}

const submit = async (event) => {
    event.preventDefault()
  
    console.log('add book...')
  
    createBook({ variables: { title, author, published, genres } })
  
    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }
  
  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }
  

    return (
    <div>

<form onSubmit={submit}>
    <div>
        title
    <input value={title} onChange={(e)=>setTitle(e.target.value)} />
    
    </div>
<div>
    author
    <input value={author}
    onChange={(e)=>setAuthor(e.target.value)}
    />
</div>
<div>
   <h1>published</h1> 
    <input type="number" 
    value={published}
    onChange={(e)=>setPublished(e.target.value)}

    
    
    />
<div>

<input value={genre}

onChange={(e)=>setGenre(e.target.value)}
/>

<button type="button"
onClick={addGenre}
>add genre</button>



</div>


<div>genres:{genres.join("")}</div>
<button type="submit"


>create book</button>

</div>
</form>

    </div>
  )
}

export default NewBook