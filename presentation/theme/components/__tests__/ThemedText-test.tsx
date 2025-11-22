import { render } from '@testing-library/react-native';
import * as React from 'react';
import { ThemedText } from '../themed-text';

describe('ThemedText', () => {
    it('renders correctly', () => {
        const { getByText } = render(<ThemedText>Snapshot test!</ThemedText>);
        expect(getByText('Snapshot test!')).toBeTruthy();
    });
});
