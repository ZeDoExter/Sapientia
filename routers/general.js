const express = require('express')
const dayjs = require('dayjs')
const db = require('../db')

const router = express.Router()

const currentTime = dayjs;

let greeting = '';
if (currentTime.hour() >= 6 && currentTime.hour() < 12) {
    greeting = 'สวัสดีตอนเช้า';
    } else if (currentTime.hour() >= 12 && currentTime.hour() < 14) {
    greeting = 'สวัสดีตอนบ่าย';
    } else if (currentTime.hour() >= 14 && currentTime.hour() < 18) {
    greeting = 'สวัสดีตอนเย็น';
    } else if (currentTime.hour() >= 18 && currentTime.hour() < 22) {
        greeting = 'สวัสดีตอนค่ำ';
    } else {
    greeting = 'สวัสดีตอนกลางคืน';
}
console.log(currentTime.hour())

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
            const createdAtText = dayjs.tz(post.createdAt).format('D MMM YYYY - HH:mm')
            return { ...post, createdAtText }
        })
    } catch (error) {
        console.error(error)
    }
    response.render("home",{ allPosts , greeting })
})



module.exports = router