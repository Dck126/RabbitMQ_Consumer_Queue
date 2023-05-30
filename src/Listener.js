class Listener {
  constructor(playlistService, mailSender) {
    this._playlistService = playlistService;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { playlistId, targetEmail } = JSON.parse(
        message.content.toString()
      );

      const playlistSongs = await this._playlistService.getPlaylistSong(
        playlistId
      );

      const result = await this._mailSender.sendEmail(
        targetEmail,
        playlistSongs.playlist.name,
        JSON.stringify(playlistSongs)
      );

      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Listener;
