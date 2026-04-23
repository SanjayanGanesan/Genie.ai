const pool = require('../db');

const sendMessage = async (req, res) => {
  try {
    const { message, conversationId } = req.body;

    if (!message || !conversationId) {
      return res.status(400).json({ error: 'Details Missing !!' });
    }

    const result = await pool.query(
      `INSERT INTO messages (conversation_id, sender, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [conversationId, 'user', message]
    );

    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.log(error, 'error occurred');
    res.status(500).json({ message: 'Error Occurred' });
  }
};


const receiveMessage = async (req,res)=>{
  try{

    const { conversationId } = req.params;
   
    const result = await pool.query(
      `SELECT * FROM messages
       WHERE conversation_id = $1
       ORDER BY created_at ASC`,
      [conversationId]
    );

    // 3. Send response
    res.status(200).json(result.rows);

  }catch(err){
    console.log(err,"error");
    res.status(500).json({ message: 'Error Occurred' });
  }
}

module.exports = { sendMessage,receiveMessage };