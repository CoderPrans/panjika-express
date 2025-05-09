import express from 'express';
const router = express.Router();

import calc from './index.js';

function convertList(list) {
  return list.map(item => {
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
}

router.get('', (req, res) => {
  let list = calc.next30(calc.lastPurnima());
  list = convertList(list);

  let amavasyaTime = list.find(item => item[0].includes('Amavasya'))[1];
  let month = calc.getMonth(amavasyaTime);

  let prevPurnima = calc.lastPurnima(calc.lastPurnima());
  let nextPurnima = calc.nextPurnima();

  res.render('index', {list, month, prevPurnima, nextPurnima});
});

router.get('/by-purnima', (req, res) => {
  // Access the query parameter
  const purnimaDateStr = req.query.purnima;

  if (!purnimaDateStr) {
    return res.status(400).json({ error: "Missing 'purnima' query parameter" });
  }

  let purnimaDate = new Date(purnimaDateStr);

  let list = calc.next30(purnimaDate);
  list = convertList(list);

  let amavasyaTime = list.find(item => item[0].includes('Amavasya'))[1];
  let month = calc.getMonth(amavasyaTime);

  let prevPurnima = calc.lastPurnima(new Date(calc.lastPurnima(purnimaDate).getTime() - 1000* 60 * 60 * 24));
  let nextPurnima = calc.nextPurnima(new Date(purnimaDate.getTime() + 1000 * 60 * 60 * 24));

  res.set('Access-Control-Allow-Origin', '*');
  res.render('index', {list, month, prevPurnima, nextPurnima});
});

router.get('/this_month', (req, res) => {
  let list = calc.next30(calc.lastPurnima());

  res.set('Access-Control-Allow-Origin', '*');
  res.json({list});
});

export default router;

