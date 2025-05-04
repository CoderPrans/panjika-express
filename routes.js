import express from 'express';
const router = express.Router();

import calc from './index.js';

router.get('', (req, res) => {
  let list = calc.next30(calc.lastPurnima());
  list = list.map(item => {
    let tithi = item[0];
    let date = new Date(item[1]);

    date = date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    return [tithi, date];
  });
  res.render('index', {list});
});

router.get('/this_month', (req, res) => {
  let list = calc.next30(calc.lastPurnima());

  res.set('Access-Control-Allow-Origin', '*');
  res.json({list});
});

export default router;

