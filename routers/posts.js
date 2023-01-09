const express = require('express')
const dayjs = require('dayjs')
const db = require('../db')

const router = express.Router()

async function getPostAndComments(postId){
    let onePost = null
    let postComments = []
    try {
        // Get one post
        const somePost = await db
            .select('*')
            .from('post')
            .where('id', +postId)
        onePost = somePost[0]
        onePost.createdAtText = dayjs().tz(onePost.createdAt).format('D MMM YYYY - HH:mm')

        // Get post comments
        postComments = await db
            .select('*')
            .from('comment')
            .where('postId', +postId)
        postComments = postComments.map(comment => {
            const createdAtText = dayjs().tz(comment.createdAt).format('D MMM YYYY - HH:mm')
            return { ...comment, createdAtText }
        })

    } catch (error) {
        console.error(error)
    }

    const customTitle = !!onePost ? `${onePost.title} | ` : `ไม่พบโพสต์ | `
    return { onePost, postComments, customTitle }
}

router.get('/new', (req,rep) =>{
    rep.render("postNew")
})

router.post('/new', async (req,rep)=>{
    const { title, content, from, accepted} = req.body ?? {}
    try {
        if(!title || !content || !from){
            throw new Error('no text')
        }
        else if (accepted != 'on'){
            throw new Error('no accpet')
        }

        await db.insert({ title, content, from, createdAt: new Date() }).into('post')
    } 
    catch (error) {
        console.error(error)
        let errorMessage = 'ใส่ข้อมูลให้ครบสิโว้ย'
        if (error.message === 'no text'){
            errorMessage = 'ใส่ข้อมูลให้มันครบหน่อยเด้ เว้นไว้ทำไมม'
        }else if (error.message === 'no accpet'){
            errorMessage = 'กดติ้กยอมรับด้วย!'
        }
        return rep.render('postNew', { errorMessage, values: { title, content, from }} )
    }
    rep.redirect('/p/new/done')
})

router.get('/new/done', (req, rep)=>{
    rep.render('postNewDone')
})


router.get('/:postId', async (req,rep)=>{
    const { postId } = req.params
    const postData = await getPostAndComments(postId)
    rep.render("postId",postData)
})

router.post('/:postId/comment', async (req, rep)=>{
    const { postId }= req.params
    const { content, from, accepted} = req.body ?? {}
    try {
        if(!content || !from){
            throw new Error('no text')
        }
        else if (accepted != 'on'){
            throw new Error('no accpet')
        }

        //Create comment
        await db.insert({ content, from, createdAt: new Date(), postId: +postId }).into('comment')
    } 
    catch (error) {
        console.error(error)
        let errorMessage = 'ใส่ข้อมูลให้ครบสิโว้ย'
        if (error.message === 'no text'){
            errorMessage = 'ใส่ข้อมูลให้มันครบหน่อยเด้ เว้นไว้ทำไมม'
        }else if (error.message === 'no accpet'){
            errorMessage = 'กดติ้กยอมรับด้วย!'
        }

        const postData = await getPostAndComments(postId)
        return rep.render('postId', { 
            ...postData, errorMessage, values: { content, from }
        } )
    }
    rep.redirect(`/p/${postId}`)
})

module.exports = router