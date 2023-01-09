const express = require('express')
const dayjs = require('dayjs')
const db = require('../db')

const router = express.Router()

const currentTime = new Date();
const currentHour = currentTime.getHours();

let greeting = '';
if (currentHour >= 6 && currentHour < 12) {
    greeting = 'สวัสดีตอนเช้า';
    } else if (currentHour >= 12 && currentHour < 18) {
    greeting = 'สวัสดีตอนบ่าย';
    } else if (currentHour >= 18 && currentHour < 22) {
    greeting = 'สวัสดีตอนเย็น';
    } else {
    greeting = 'สวัสดีตอนกลางคืน';
}

router.get('/', async (request, response) =>{
    let allPosts = []
    try {
        allPosts = await db
            .select('post.id', 'post.title', 'post.from', 'post.from', 'post.createdAt')
            .count('comment.id as commentsCount')
            .from('post')
            .leftJoin('comment', 'post.id', 'comment.postId')
            .groupBy('post.id')
            .orderBy('post.id', 'desc')
        allPosts = allPosts.map(post => {
            const createdAtText = dayjs(post.createdAt).format('D MMM YYYY - HH:mm')
            return { ...post, createdAtText }
        })
    } catch (error) {
        console.error(error)
    }
    response.render("home",{ allPosts , greeting })
})



module.exports = router