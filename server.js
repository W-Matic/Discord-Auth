require('dotenv').config();
const express = require('express');
const axios = require('axios');
const url = require('url');
const mongoose = require('mongoose');

const port = process.env.PORT || 1500;
const app = express();

mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB successfully');
});

const userCreatorSchema = new mongoose.Schema({
  user_ID: String,
  user_avatar_ID: String,
  user_email: String,
  refresh_token: String
});

const discordCredentialsSchema = new mongoose.Schema({
  user_creator: userCreatorSchema
});

const DiscordCredentials = mongoose.model('DiscordCredentials', discordCredentialsSchema);

async function addMemberToGuild(userId, accessToken) {
  const guildId = process.env.Guild_ID;
  const roleId = process.env.Role_ID;

  try {
    const options = {
      access_token: accessToken,
      nick: null,
      roles: [roleId],
      mute: false,
      deaf: false,
    };

    const headers = {
      Authorization: `Bot ${process.env.BOT_TOKEN}`,
      'Content-Type': 'application/json',
    };

    const response = await axios.put(
      `https://discord.com/api/guilds/${guildId}/members/${userId}`,
      options,
      { headers: headers }
    );

    if (response.status === 201 || response.status === 204) {
      console.log(`Successfully added member ${userId} to guild ${guildId} and assigned role ${roleId}`);
    } else {
      throw new Error(`Failed to add member: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error adding member:', error);
  }
}



app.get('/api/auth/discord/redirect', async (req, res) => {
  const { code } = req.query;

  if (code) {
    const formData = new url.URLSearchParams({
      client_id: process.env.ClientID,
      client_secret: process.env.ClientSecret,
      grant_type: 'authorization_code',
      code: code.toString(),
      redirect_uri: 'http://localhost:1500/api/auth/discord/redirect',
    });

    try {
      const response = await axios.post('https://discord.com/api/v10/oauth2/token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.data) {
        const { access_token, refresh_token } = response.data;

        const userinfo = await axios.get('https://discord.com/api/v10/users/@me', {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        // Save data to MongoDB
        const discordCredentials = new DiscordCredentials({
          user_creator: {
            user_ID: userinfo.data.id,
            user_avatar_ID: userinfo.data.avatar,
            user_email: userinfo.data.email,
            refresh_token: refresh_token
          }
        });
        await discordCredentials.save();

        console.log('User data saved to the database');

        await addMemberToGuild(userinfo.data.id, access_token);

        res.send('Authorized succesfully you are now part of the server and have the desired role!');
      }
    } catch (error) {
      console.error("Error:", error.response.data);
      res.status(500).send('Error during authentication');
    }
  }
});

app.listen(port, () => {
  console.log(`Running on ${port}`);
});
