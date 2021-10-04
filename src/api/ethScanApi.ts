import service from '@/api/request';

export const getNfts = (data) => {
  console.log(data);
  data = {
    module: 'account',
    action: 'tokennfttx',
    contractaddress: '0xbe529277d878da341e015399d7fa403a0176ae0c',
    address: '0x899bd466d50e861351fb1faa303cab08bdb03725',
    page: 1,
    offset: 100,
    sort: 'asc',
    apikey: 'GRY3WMI5DKNY7P75PUNX4IH9IK17WW5J9Y',
  };
  return service({
    method: 'get',
    params: data,
  });
};
