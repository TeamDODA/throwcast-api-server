const Podcast = require('../api/podcast/podcast.model');
const Station = require('../api/station/station.model');
const db = require('../db');

const stations = [{
  title: 'Fantasy Football Today Podcast',
  link: 'http://fantasynews.cbssports.com/fantasyfootball',
  description: 'fantasy news',
  imageUrl: 'http://podcasts.cstv.com/graphics/fantasy_football_today.jpg',
  podcasts: [{
    title: '08/12 Fantasy Football Podcast: Handcuffs, 2-QB Leagues, Thursday Winners and Losers',
    link: 'http://cstvpodcast.cstv.com.edgesuite.net/fantasyplaybook/081216_fantasyfootball_podcast.mp3',
    description: 'About Qbs',
    pubDate: 'Fri, 12 Aug 2016 13:40:13 -0400',
    imageUrl: 'http://podcasts.cstv.com/graphics/fantasy_football_today.jpg',
  }, {
    title: '07/29 Fantasy Football Podcast: Sneaky Storylines - AFC and NFC North! Also David Johnson\'s Carries',
    link: 'http://cstvpodcast.cstv.com.edgesuite.net/fantasyplaybook/072916_fantasyfootball_podcast.mp3',
    description: '07/29 Fantasy Football Podcast: Sneaky Storylines - AFC and NFC North! Also David Johnson\'s Carries',
    pubDate: 'Fri, 29 Jul 2016 13:37:36 -0400',
    imageUrl: 'http://podcasts.cstv.com/graphics/fantasy_football_today.jpg',
  }, {
    title: '08/02 Fantasy Football Podcast: Crazy QB Stat, PPR Draft Review',
    link: 'http://cstvpodcast.cstv.com.edgesuite.net/fantasyplaybook/080216_fantasyfootball_podcast.mp3',
    description: '08/02 Fantasy Football Podcast: Crazy QB Stat, PPR Draft Review',
    pubDate: 'Tue, 02 Aug 2016 13:23:07 -0400',
    imageUrl: 'http://podcasts.cstv.com/graphics/fantasy_football_today.jpg',
  }, {
    title: '08/08 Fantasy Football Podcast: Strategy Show! How to Approach Drafts in 2016',
    link: 'http://cstvpodcast.cstv.com.edgesuite.net/fantasyplaybook/080816_fantasyfootball_podcast.mp3',
    description: '08/08 Fantasy Football Podcast: Strategy Show! How to Approach Drafts in 2016',
    pubDate: 'Mon, 08 Aug 2016 13:21:08 -0400',
    imageUrl: 'http://podcasts.cstv.com/graphics/fantasy_football_today.jpg',
  }, {
    title: '08/09 Fantasy Football Podcast: Tight Ends Preview',
    link: 'http://cstvpodcast.cstv.com.edgesuite.net/fantasyplaybook/080916_fantasyfootball_podcast.mp3',
    description: '08/09 Fantasy Football Podcast: Tight Ends Preview',
    pubDate: 'Tue, 09 Aug 2016 13:27:08 -0400',
    imageUrl: 'http://podcasts.cstv.com/graphics/fantasy_football_today.jpg',
  }, {
    title: '08/11 Fantasy Football Podcast: Running Backs Preview Part Two',
    link: 'http://cstvpodcast.cstv.com.edgesuite.net/fantasyplaybook/081116_fantasyfootball_podcast.mp3',
    description: 'About Rbs',
    pubDate: 'Mon, 08 Aug 2016 01:00:02 -0400',
    imageUrl: 'http://podcasts.cstv.com/graphics/fantasy_football_today.jpg',
  }],
}, {
  title: 'NPR Politics Podcast',
  link: 'http://www.npr.org/sections/politics/',
  description: 'News and politics',
  imageUrl: 'https://media.npr.org/assets/img/2015/11/13/nprpolitics_red1400px_sq-6bc03b536409ec88fd8d3abb637b560e93865bad.png?s=1400',
  podcasts: [{
    title: 'Weekly Roundup: Thursday, August 11',
    link: 'http://play.podtrac.com/npr-510310/npr.mc.tritondigital.com/NPR_510310/media/anon.npr-mp3/npr/nprpolitics/2016/03/20160317_nprpolitics_roundup.mp3?orgId=1&d=2447&p=510310&story=470832129&t=podcast&e=470832129&ft=pod&f=510310',
    description: 'Weekly Round-up 8/11',
    pubDate: 'Thu, 04 Aug 2016 20:52:00 -0400',
    imageUrl: 'https://media.npr.org/assets/img/2015/11/13/nprpolitics_red1400px_sq-6bc03b536409ec88fd8d3abb637b560e93865bad.png?s=1400',
  }, {
    title: 'Quick Take: Trump and the Khans',
    link: 'http://play.podtrac.com/npr-510310/npr.mc.tritondigital.com/NPR_510310/media/anon.npr-mp3/npr/nprpolitics/2016/08/20160801_nprpolitics_trumpandkhans.mp3?orgId=1&d=1309&p=510310&story=487884753&t=podcast&e=487884753&ft=pod&f=510310',
    description: 'Khans and Trump',
    pubDate: 'Mon, 08 Aug 2016 01:00:02 -0400',
    imageUrl: 'https://media.npr.org/assets/img/2015/11/13/nprpolitics_red1400px_sq-6bc03b536409ec88fd8d3abb637b560e93865bad.png?s=1400',
  }, {
    title: 'Food Politics<',
    link: 'http://play.podtrac.com/npr-510310/npr.mc.tritondigital.com/NPR_510310/media/anon.npr-mp3/npr/nprpolitics/2016/08/20160805_nprpolitics_food.mp3?orgId=1&d=1365&p=510310&story=488810228&t=podcast&e=488810228&ft=pod&f=510310',
    description: 'Food Politics<',
    pubDate: 'Mon, 08 Aug 2016 01:00:02 -0400',
    imageUrl: 'https://media.npr.org/assets/img/2015/11/13/nprpolitics_red1400px_sq-6bc03b536409ec88fd8d3abb637b560e93865bad.png?s=1400',
  }, {
    title: 'Democratic National Convention: Friday, July 29',
    link: 'http://play.podtrac.com/npr-510310/npr.mc.tritondigital.com/NPR_510310/media/anon.npr-mp3/npr/nprpolitics/2016/07/20160729_nprpolitics_politics_podcast_final_audio__-_dnc_day_4.mp3?orgId=1&d=1942&p=510310&story=487716892&t=podcast&e=487716892&ft=pod&f=510310',
    description: 'Democratic National Convention: Friday, July 29',
    pubDate: 'Fri, 29 Jul 2016 05:53:00 -0400',
    imageUrl: 'https://media.npr.org/assets/img/2015/11/13/nprpolitics_red1400px_sq-6bc03b536409ec88fd8d3abb637b560e93865bad.png?s=1400',
  }, {
    title: 'Democratic National Convention: Thursday, July 28',
    link: 'http://play.podtrac.com/npr-510310/npr.mc.tritondigital.com/NPR_510310/media/anon.npr-mp3/npr/nprpolitics/2016/07/20160728_nprpolitics_dncdaythree.mp3?orgId=1&d=2043&p=510310&story=487715776&t=podcast&e=487715776&ft=pod&f=510310',
    description: 'Democratic National Convention: Thursday, July 28',
    pubDate: 'Thu, 28 Jul 2016 04:09:00 -0400',
    imageUrl: 'https://media.npr.org/assets/img/2015/11/13/nprpolitics_red1400px_sq-6bc03b536409ec88fd8d3abb637b560e93865bad.png?s=1400',
  }, {
    title: 'Democratic National Convention: Wednesday, July 27',
    link: 'http://play.podtrac.com/npr-510310/npr.mc.tritondigital.com/NPR_510310/media/anon.npr-mp3/npr/nprpolitics/2016/07/20160727_nprpolitics_dncdaytwo.mp3?orgId=1&d=1711&p=510310&story=487565281&t=podcast&e=487565281&ft=pod&f=510310',
    description: 'Democratic National Convention: Wednesday, July 27',
    pubDate: 'Wed, 27 Jul 2016 03:37:00 -0400',
    imageUrl: 'https://media.npr.org/assets/img/2015/11/13/nprpolitics_red1400px_sq-6bc03b536409ec88fd8d3abb637b560e93865bad.png?s=1400',
  }],
}, {
  title: 'Masters in Business',
  link: 'http://bloomberg.com/podcasts/masters_in_business',
  description: 'Business',
  imageUrl: 'http://assets.bwbx.io/images/users/iqjWHBFdfxIU/iEoalcJjRdfA/v2/-999x-999.jpg',
  podcasts: [{
    title: 'Interview With Michael Mauboussin: Masters in Business',
    link: 'http://assets.bwbx.io/av/users/iqjWHBFdfxIU/v0MZ_SkpBnE0/v2.mp3',
    description: 'Interview With Michael Mauboussin: Masters in Business',
    pubDate: 'Fri, 12 Aug 2016 21:42:41 GMT',
    imageUrl: 'http://assets.bwbx.io/images/users/iqjWHBFdfxIU/iEoalcJjRdfA/v2/-999x-999.jpg',
  }, {
    title: 'Interview With Louis Navellier: Masters in Business',
    link: 'http://assets.bwbx.io/av/users/iqjWHBFdfxIU/vQwIy3K7OUrc/v3.mp3',
    description: 'Interview With Louis Navellier: Masters in Business',
    pubDate: 'Mon, 11 Jul 2016 12:37:33 GMT',
    imageUrl: 'http://assets.bwbx.io/images/users/iqjWHBFdfxIU/iEoalcJjRdfA/v2/-999x-999.jpg',
  }, {
    title: 'Interview With Ross Buchmueller: Masters in Business',
    link: 'http://assets.bwbx.io/av/users/iqjWHBFdfxIU/v.z6PwlwOywA/v2.mp3',
    description: 'Interview With Ross Buchmueller: Masters in Business',
    pubDate: 'Fri, 01 Jul 2016 19:38:41 GMT',
    imageUrl: 'http://assets.bwbx.io/images/users/iqjWHBFdfxIU/iEoalcJjRdfA/v2/-999x-999.jpg',
  }, {
    title: 'Interview With Edward Yardeni: Masters in Business',
    link: 'http://assets.bwbx.io/av/users/iqjWHBFdfxIU/vPu5Y7wC3vF4/v2.mp3',
    description: 'Interview With Edward Yardeni: Masters in Business',
    pubDate: 'Fri, 10 Jun 2016 15:18:34 GMT',
    imageUrl: 'http://assets.bwbx.io/images/users/iqjWHBFdfxIU/iEoalcJjRdfA/v2/-999x-999.jpg',
  }, {
    title: 'Interview With Gianni Kovacevic: Masters in Business',
    link: 'http://assets.bwbx.io/av/users/iqjWHBFdfxIU/vs2TbchEr.rc/v2.mp3',
    description: 'Interview With Gianni Kovacevic: Masters in Business',
    pubDate: 'Fri, 22 Jul 2016 20:39:03 GMT',
    imageUrl: 'http://assets.bwbx.io/images/users/iqjWHBFdfxIU/iEoalcJjRdfA/v2/-999x-999.jpg',
  }, {
    title: 'Interview With Jack Schwager: Masters in Business',
    link: 'http://assets.bwbx.io/av/users/iqjWHBFdfxIU/vwb7ZmWjPjpg/v2.mp3',
    description: 'Interview With Jack Schwager: Masters in Business',
    pubDate: 'Fri, 22 Jul 2016 20:39:03 GMT',
    imageUrl: 'http://assets.bwbx.io/images/users/iqjWHBFdfxIU/iEoalcJjRdfA/v2/-999x-999.jpg',
    station: ''
  }],
}, {
  title: 'All Songs Considered',
  link: 'http://www.npr.org/allsongs',
  description: 'Songs',
  imageUrl: 'https://media.npr.org/images/podcasts/primary/icon_510019-045e9424ceb1fd4f5ae73df269de73b8094cd25e.jpg?s=1400',
  podcasts: [{
    title: 'Blood Orange, NAO, Joyce Manor, Factory Floor, More',
    link: 'http://play.podtrac.com/npr-510019/npr.mc.tritondigital.com/ALLSONGS_PODCAST/media/anon.npr-mp3/npr/asc/2016/08/20160809_asc_wholeshow.mp3?orgId=1&d=2302&p=510019&story=489338770&t=podcast&e=489338770&ft=pod&f=510019',
    description: 'Blood Orange, NAO, Joyce Manor, Factory Floor, More',
    pubDate: 'Tue, 09 Aug 2016 13:32:00 -0400',
    imageUrl: 'https://media.npr.org/images/podcasts/primary/icon_510019-045e9424ceb1fd4f5ae73df269de73b8094cd25e.jpg?s=1400',
    station: ''
  }, {
    title: 'All Songs +1: A Conversation With Radiohead\'s Jonny Greenwood',
    link: 'http://play.podtrac.com/npr-510019/npr.mc.tritondigital.com/ALLSONGS_PODCAST/media/anon.npr-mp3/npr/asc/2016/08/20160804_asc_wholeshow2.mp3?orgId=1&d=1478&p=510019&story=488584530&t=podcast&e=488584530&ft=pod&f=510019',
    description: 'All Songs +1: A Conversation With Radiohead\'s Jonny Greenwood',
    pubDate: 'Thu, 04 Aug 2016 10:00:30 -0400',
    imageUrl: 'https://media.npr.org/images/podcasts/primary/icon_510019-045e9424ceb1fd4f5ae73df269de73b8094cd25e.jpg?s=1400',
  }, {
    title: 'New Mix: Regina Spektor, Lowell, Angelica Garcia, More',
    link: 'http://play.podtrac.com/npr-510019/npr.mc.tritondigital.com/ALLSONGS_PODCAST/media/anon.npr-mp3/npr/asc/2016/08/20160802_asc_wholeshow.mp3?orgId=1&d=2232&p=510019&story=488411913&t=podcast&e=488411913&ft=pod&f=510019',
    description: 'New Mix: Regina Spektor, Lowell, Angelica Garcia, More',
    pubDate: 'Tue, 02 Aug 2016 15:49:00 -0400',
    imageUrl: 'https://media.npr.org/images/podcasts/primary/icon_510019-045e9424ceb1fd4f5ae73df269de73b8094cd25e.jpg?s=1400',
  }, {
    title: 'All Songs +1: Sofar Sounds Wants To Bring Your Favorite Musicians To Your Home',
    link: 'http://play.podtrac.com/npr-510019/npr.mc.tritondigital.com/ALLSONGS_PODCAST/media/anon.npr-mp3/npr/asc/2016/07/20160729_asc_wholeshow.mp3?orgId=1&d=1288&p=510019&story=487947558&t=podcast&e=487947558&ft=pod&f=510019',
    description: 'All Songs +1: Sofar Sounds Wants To Bring Your Favorite Musicians To Your Home',
    pubDate: 'Fri, 29 Jul 2016 14:41:00 -0400',
    imageUrl: 'https://media.npr.org/images/podcasts/primary/icon_510019-045e9424ceb1fd4f5ae73df269de73b8094cd25e.jpg?s=1400',
  }, {
    title: 'New Mix: Wilco, Sleigh Bells, The Julie Ruin, JEFF The Brotherhood, More',
    link: 'http://play.podtrac.com/npr-510019/npr.mc.tritondigital.com/ALLSONGS_PODCAST/media/anon.npr-mp3/npr/asc/2016/07/20160721_asc_wholeshow.mp3?orgId=1&d=2842&p=510019&story=487617392&t=podcast&e=487617392&ft=pod&f=510019',
    description: 'New Mix: Wilco, Sleigh Bells, The Julie Ruin, JEFF The Brotherhood, More',
    pubDate: 'Wed, 27 Jul 2016 11:04:00 -0400',
    imageUrl: 'https://media.npr.org/images/podcasts/primary/icon_510019-045e9424ceb1fd4f5ae73df269de73b8094cd25e.jpg?s=1400',
  }, {
    title: 'Newport Folk 2016 Preview: Patti Smith, Flight Of The Conchords, More',
    link: 'http://play.podtrac.com/npr-510019/npr.mc.tritondigital.com/ALLSONGS_PODCAST/media/anon.npr-mp3/npr/asc/2016/07/20160719_asc_wholeshow.mp3?orgId=1&d=1889&p=510019&story=486630225&t=podcast&e=486630225&ft=pod&f=510019',
    description: 'Newport Folk 2016 Preview: Patti Smith, Flight Of The Conchords, More',
    pubDate: 'Tue, 19 Jul 2016 14:07:00 -0400',
    imageUrl: 'https://media.npr.org/images/podcasts/primary/icon_510019-045e9424ceb1fd4f5ae73df269de73b8094cd25e.jpg?s=1400',
  }],
}];

const seed = function seed() {
  return Station.create(stations)
    .then(created => stations
      .reduce((prev, current, i) => prev.concat(
        current.podcasts.map(podcast => Object.assign({}, podcast, { station: created[i]._id }))), []))
    .then(podcasts => Podcast.create(podcasts))
    .catch(err => console.log(err));
};

db.connect().then(() => seed()).then(() => db.connection.close());
