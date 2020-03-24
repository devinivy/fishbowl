const { useState, useCallback, ...React } = require('react');
const T = require('prop-types');
const { default: Styled } = require('styled-components');
const { default: TextField } = require('@material-ui/core/TextField');
const { default: Button } = require('@material-ui/core/Button');
const { default: Box } = require('@material-ui/core/Box');

const internals = {};

module.exports = function SubmitWordsForm({ onSubmit }) {

    const [word1, setWord1] = useState('');
    const [word2, setWord2] = useState('');
    const [word3, setWord3] = useState('');
    const [word4, setWord4] = useState('');
    const [word5, setWord5] = useState('');
    const words = [word1, word2, word3, word4, word5];

    const handle = useCallback((setter) => {

        return (ev) => setter(ev.target.value);
    }, []);

    const handleSubmit = (ev) => {

        ev.preventDefault();
        onSubmit(words);
    };

    const { FieldWrapper } = internals;

    return (
        <Box
            component='form'
            display='flex'
            flexDirection='column'
            alignItems='flex-end'
            onSubmit={handleSubmit}
        >
            <FieldWrapper display='flex' flexWrap='wrap'>
                <TextField size='small' margin='normal' placeholder='first word' value={word1} onChange={handle(setWord1)} />
                <TextField size='small' margin='normal' placeholder='second word' value={word2} onChange={handle(setWord2)} />
                <TextField size='small' margin='normal' placeholder='third word' value={word3} onChange={handle(setWord3)} />
                <TextField size='small' margin='normal' placeholder='fourth word' value={word4} onChange={handle(setWord4)} />
                <TextField size='small' margin='normal' placeholder='fifth word' value={word5} onChange={handle(setWord5)} />
                <div />
                <div />
                <div />
            </FieldWrapper>
            <Button
                type='submit'
                disabled={!words.every(Boolean)}
                variant='outlined'
                color='primary'
            >
                ready
            </Button>
        </Box>
    );
};

module.exports.propTypes = {
    onSubmit: T.func.isRequired
};

internals.FieldWrapper = Styled(Box)`
    margin-bottom: ${({ theme }) => theme.spacing(1)}px;
    > * {
        padding-right: ${({ theme }) => theme.spacing(1)}px;
        min-width: 120px;
        flex: 1 0 20%;
    }
`;
