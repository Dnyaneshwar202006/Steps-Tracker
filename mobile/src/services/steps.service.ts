import api from '../api/client';

export const saveSteps = async (date: string, steps: number) => {
  const res = await api.post('/steps/v1', {
    date,
    steps,
  });

  return res.data;
};

export const getSteps = async (date: string) => {
  const res = await api.get('/steps/v1/steps', {
    params: {
      date,
    },
  });

  return res.data;
};

export const getHistory = async () => {
  const res = await api.get('/steps/v1/history');

  return res.data;
};
