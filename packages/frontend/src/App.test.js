require('regenerator-runtime/runtime');

const React = require('react');
const Testing = require('@testing-library/react');
const M = require('./middle-end');
const App = require('./App');

it('renders without crashing.', () => {

    const middleEnd = M.create().initialize();

    const { getByText } = Testing.render(
        <App
            middleEnd={middleEnd}
            history={middleEnd.mods.router.history}
        />
    );

    expect(getByText('Fishbowl')).toBeDefined();
});
