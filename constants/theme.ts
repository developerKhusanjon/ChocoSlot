export const theme = {
    colors: {
        primary: '#6B9BD1',
        secondary: '#F4A261',
        accent: '#E76F51',
        success: '#37b3e1',
        warning: '#F4A261',
        error: '#E76F51',
        background: '#FEFEFE',
        surface: '#FFFFFF',
        surfaceVariant: '#F8F9FA',
        onSurface: '#2D3748',
        onSurfaceVariant: '#718096',
        border: '#E2E8F0',
        shadow: 'rgba(0, 0, 0, 0.1)',

        // Status colors
        pending: '#F59E0B',
        confirmed: '#10B981',
        completed: '#6366F1',

        // Gradient colors
        gradientStart: '#6B9BD1',
        gradientEnd: '#A8DADC',

        // Card backgrounds
        cardBlue: '#E3F2FD',
        cardPeach: '#FFF3E0',
        cardGreen: '#E8F5E8',
        cardPink: '#FCE4EC'
    },

    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48
    },

    borderRadius: {
        sm: 8,
        md: 12,
        lg: 16,
        xl: 30,
        full: 9999
    },

    fontSize: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        xxl: 24,
        xxxl: 32
    },

    fontWeight: {
        normal: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const
    }
};