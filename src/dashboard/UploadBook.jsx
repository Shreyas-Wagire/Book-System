import React, { useState } from 'react'
import { Button, Checkbox, Label, Select, TextInput, Textarea } from "flowbite-react";
const UploadBook = () => {
  const bookCategories = [
    "Civil",
    "Machanical",
    "Computer Science",
    "Electrical",
    "Food Technology",
    "Aronotical",
    "CSE IOT",
    "AIDS"
  ]

  const [selectedBookCategory, setSelectedBookCategory] = useState(bookCategories[0]);

  const handleChangeSelectedValue = (event) => {
    // console.log(event.target.value);
    setSelectedBookCategory(event.target.value);
  }

  //handle book submission
  const handleBookSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    
    const bookTitle = form.bookTitle.value;
    const authorName = form.authorName.value;
    const imgUrl = form.imgUrl.value;
    const category = form.categoryName.value;
    const bookDescription = form.bookDescription.value;
    const bookPdfUrl = form.bookPdfUrl.value;

    const bookObj = {
      bookTitle,authorName,imgUrl,category,bookDescription,bookPdfUrl
    }

    console.log(bookObj);

    //send data to DB

    fetch("http://localhost:5000/upload-book", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(bookObj)
    })
      .then(res => res.json())
      .then(data => {
        // console.log(data);
        alert("Books are loaded successfully!");
        form.reset();
      });
    
  }

  return (
    <div className='px-4 my-12'>
      <h2 className='mb-8 text-3xl font-bold'>Upload A Book</h2>

      <form onSubmit={handleBookSubmit} className="flex lg:w-[1180px] flex-col flex-wrap gap-4">
        {/* 1st book */}

        <div className='flex gap-8'>
          <div className='lg:w-1/2'>
            <div className="mb-2 block">
              <Label htmlFor="bookTitle" value="Book Title" />
            </div>
            <TextInput id="bookTitle" name='bookTitle' type="text" placeholder="Book Name" required />
          </div>

          <div className='lg:w-1/2'>
            <div className="mb-2 block">
              <Label htmlFor="authorName" value="Author Name" />
            </div>
            <TextInput id="authorName" name='authorName' type="text" placeholder="Author Name" required />
          </div>
        </div>

        {/* 2nd */}
        <div className='flex gap-8'>
          <div className='lg:w-1/2'>
            <div className="mb-2 block">
              <Label htmlFor="imgUrl" value="Book Image URL" />
            </div>
            <TextInput id="imgUrl" name='imgUrl' type="text" placeholder="Book Image URL" required />
          </div>

          {/* category */}
          <div className='lg:w-1/2'>
            <div className="mb-2 block">
              <Label htmlFor="inputSate" value="Book Category" />
            </div>

            <Select id="inputSate" name="categoryName" className='w-full rounded' value={selectedBookCategory} onChange={handleChangeSelectedValue}>
              {
                bookCategories.map((Option) => <option key={Option} value={Option}>{Option}</option>)
              }
            </Select>
          </div>
        </div>

        {/* bookDescription */}
        <div>
          <div className="mb-2 block">
            <Label htmlFor="bookDescription" value="Book Description" />
          </div>
          <Textarea id="bookDescription" name='bookDescription' placeholder="Write Your Book Description" required rows={6} className='w-full ' />
        </div>

            {/*pdf link*/}

            <div>
        <div className="mb-2 block">
          <Label htmlFor="bookPdfUrl" value="Book Pdf Url" />
        </div>
        <TextInput id="bookPdfUrl" name='bookPdfUrl' type="text" placeholder="Book Pdf Url" required />
      </div>

      <Button type="submit" className='mt-5'>Upload Book</Button>
      
      </form>
    </div>
  )
}

export default UploadBook