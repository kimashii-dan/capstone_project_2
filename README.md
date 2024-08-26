# capstone_project_2
This is my second Javascript capstone project that gives me better understanding of requests/responses, asynchronous processes, routes and references. List of tools that I used: Node.js, Express.js, EJS, PostgreSQL and API: "https://openlibrary.org/developers/api".  

This website is essentially a library of books that user has already read. So the idea is that user can search for any book, he can add it, and after that he can write notes/comments about particular book. I've implemented CREATE, READ, UPDATE and DELETE functionality.

The general logic isn't that hard: User writes title in input => Fetch data through API url with user input => Put data into Database => Fetch data from Database => Display it using EJS.
It's just all about fetching data from something, taking user's input, inserting-updating-deleting it, and finally display it.

Personally the most exciting part was to create a search input - you can just type any book and it will give you a huge amount of data back about that book. 

At the end of the day I was a little bit confused that website loads very slowly. The reasons might be internet connection, or API latency as Google says, or my laptop is weak, I do not know. But sooner I want to figure out how to deal with this kind of problems.

I haven't learned React yet, but I'll start it very soon. And hopefully it will give me more freedom and opportunites to do something truly wonderful. Maybe not wonderful for you, but at least for me.
