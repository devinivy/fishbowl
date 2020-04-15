/* eslint-disable jsx-a11y/no-autofocus */
const React = require('react');
const { useCallback } = require('react');
const T = require('prop-types');
const { default: useToggle } = require('react-use/lib/useToggle');
const { default: Styled } = require('styled-components');
const { default: Button } = require('@material-ui/core/Button');
const { default: IconButton } = require('@material-ui/core/IconButton');
const { default: Dialog } = require('@material-ui/core/Dialog');
const { default: DialogTitle } = require('@material-ui/core/DialogTitle');
const { default: DialogContent } = require('@material-ui/core/DialogContent');
const { default: DialogContentText } = require('@material-ui/core/DialogContentText');
const { default: DialogActions } = require('@material-ui/core/DialogActions');
const { default: MeetingRoom } = require('@material-ui/icons/MeetingRoom');
const { default: Pink } = require('@material-ui/core/colors/pink');

const internals = {};

module.exports = function EndGameConfirmationButton({ onConfirm, ...others }) {

    const [open, toggleOpen] = useToggle(false);
    const { RedIconButton } = internals;
    const handleConfirm = useCallback((ev) => {

        toggleOpen();
        onConfirm(ev);
    }, [toggleOpen, onConfirm]);

    return (
        <>
            <RedIconButton
                color='inherit'
                onClick={toggleOpen}
                {...others}
            >
                <MeetingRoom />
            </RedIconButton>
            <Dialog open={open} onClose={toggleOpen}>
                <DialogTitle>
                    End Game
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure everyone is done playing?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={toggleOpen} color='primary'>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} color='primary'>
                        Yep
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

module.exports.propTypes = {
    onConfirm: T.func
};

internals.RedIconButton = Styled(IconButton)`
    color: ${Pink[300]};
`;
