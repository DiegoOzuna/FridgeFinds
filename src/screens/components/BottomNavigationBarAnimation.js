  export const BottomNavigationBarAnimation = () => ({
    cardStyleInterpolator: ({ current, layouts }) => {
      return {
        cardStyle: {
          transform: [
            {
              translateY: current.progress.interpolate({
                inputRange: [0, 0.1],
                outputRange: [0, 0],
              }),
            },
          ],
        },
      };
    },
  });
  