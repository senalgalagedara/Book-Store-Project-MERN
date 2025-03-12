import express, { response } from "express";
import {PORT ,mongoDBURL} from "./config.js"
import mongoose  from "mongoose";
import {Book} from './models/bookModel.js';
const app = express();

app.use(express.json());
app.get('/',(request, response)=>{
    console.log(request);
    return response.status(234).send("Hello Senal");
});

// create book db?
app.post('/books',async(request, response)=>{
    try{
        if(
            !request.body.title ||
            !request.body.author ||
            !request.body.publishYear
        ){
            return response.status(400).send({
                message: 'Send all requred fields',
            });
        }
        const newBook = {
            title: request.body.title,
            author: request.body.author,
            publishYear: request.body.publishYear,
        };
        const book = await Book.create(newBook);

        return response.status(200).send(book);
    }catch (error){
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

//get book by id?
app.post('/books/:id',async(request, response)=>{
    try{
        const {id} = request.params;
        const books = await Book.findByID({});

        return response.status(200).json({
            count : books.length,
            data : books
        });
        return response.status(200).send(book);
    }catch (error){
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

app.listen(PORT, ()=>{
    console.log(`APP is listening to port: ${PORT}`);
});

app.get('/books',async (request, response)=>{
    try{
        const books = await Book.find({});
        return response.status(200).json({
            count: books.length,
            data: books
        });
    }catch (error){
        console.log(error.message);
        response.status(500).send({ message : error.message});
    }
});

//update book
app.put('./books/:id',async (request, response)=>{
    try{
        if(
            !request.body.title ||
            !request.body.author ||
            !request.body.publishYear
        ){
            return response.status(400).send({
                message: 'Send all requred fields',
            });
        }
        const {id} = request.params;
        const result = await Book.findByIdAndUpdate(id,request.body);
        if(!result){
            return response.status(404).json({message: 'Book not found'});
        }
        return response.status(200).send({message: 'Book updated successfully'});
    }catch (error){
        console.log(error.message);
        response.status(500).send({ message : error.message});
    }
});

//delete book
app.delete('./books/:id',async (request, response)=>{
    try{
        const {id} = request.params;
        const result = await Book.findByIdAndUpdate(id,request.body);
        if(!result){
            return response.status(404).json({message: 'Book not found'});
        }
        return response.status(200).send({message: 'Book deleted successfully'});
    }catch (error){
        console.log(error.message);
        response.status(500).send({ message : error.message});
    }
});
mongoose
    .connect(mongoDBURL)
    .then(()=>{
        console.log('App connected to database');
        app.listen(PORT,()=>{
            console.log(`App is listening to port: ${PORT}`);
        });
    })
    .catch((error)=>{
        console.log(error);
    });