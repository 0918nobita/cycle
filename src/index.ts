import { Driver, run } from '@cycle/run';
import { Stream } from 'xstream';

type Named<Name extends string, Effect> = { [_ in Name]: Effect };

type Eff = 'custom';

type AnonSi = Stream<number>;
type AnonSo = Stream<string>;

type NamedSi = Named<Eff, AnonSi>;
type NamedSo = Named<Eff, AnonSo>;

function main({ custom }: NamedSo): NamedSi {
  custom.addListener({
    next(v) {
      console.log({ v });
    },
  });

  return {
    custom: Stream.from([1, 2, 3]),
  };
}

function makeMyDriver(): Driver<AnonSi, AnonSo> {
  return function counterDriver($) {
    return $.map((i) => `${i}!`);
  };
}

run(main, {
  custom: makeMyDriver(),
});

// 1!
// 2!
// 3!
