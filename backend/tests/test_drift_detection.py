import unittest
from app.services.evaluation_consistency import has_score_drift, has_directional_drift

class TestDriftDetection(unittest.TestCase):
    def test_has_score_drift(self):
        # Low variance
        self.assertFalse(has_score_drift([0.8, 0.85, 0.82]))
        # High variance
        self.assertTrue(has_score_drift([1.0, 0.0, 1.0]))
        # Not enough samples
        self.assertFalse(has_score_drift([0.9, 0.2]))

    def test_has_directional_drift(self):
        # No drift
        self.assertFalse(has_directional_drift([0.8, 0.85, 0.82]))
        # Upward drift (should be False)
        self.assertFalse(has_directional_drift([0.6, 0.7, 0.8]))
        # Downward drift > 0.15
        self.assertTrue(has_directional_drift([0.8, 0.7, 0.6])) # 0.6 < 0.8 - 0.15 (0.65) -> True
        # Downward drift < 0.15
        self.assertFalse(has_directional_drift([0.8, 0.75, 0.7])) # 0.7 < 0.8 - 0.15 (0.65) -> False (0.7 is not less than 0.65)
        # Not enough samples
        self.assertFalse(has_directional_drift([0.9, 0.2]))

if __name__ == '__main__':
    unittest.main()
