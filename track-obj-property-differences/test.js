import { trackObjPropertyDifferences } from './track-obj-property-differences';

let trackObjects;
let latest;

const mocks = {
  mock1: {
    name: 'kat',
    animal: 'cat',
    ref: 100011,
    types: ['animal', 'mammal', 'feline'],
  },

  mock2: {
    name: 'george',
    animal: 'cat',
    ref: 100011,
    types: ['animal', 'mammal', 'feline'],
  },

  mock3: {
    name: 'sarah',
    animal: 'tiger',
    ref: 100011,
    types: ['animal', 'mammal', 'feline'],
  },

  mock5: {
    name: 'ali',
    animal: 'pupper',
    ref: 100012,
    types: ['animal', 'mammal', 'canine'],
  },

  mock6: {
    name: 'yazmine',
    animal: 'pupper',
    ref: 100013,
    types: ['animal', 'mammal', 'canine'],
  },
};

beforeEach(() => {
  trackObjects = trackObjPropertyDifferences();
  Object.entries(mocks).forEach(([mockId, mockVal]) => {
    latest = trackObjects({
      objId: mockId,
      trackedObj: mockVal,
    });
  });
});

test('Output comparison should be created by trackObjects() calls', () => {
  console.log('latest: ', latest);
  expect(latest).toBeDefined();
});
