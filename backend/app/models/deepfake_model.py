import torch
import torch.nn as nn


class LightweightDeepfakeNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Conv2d(3, 16, 3, stride=2, padding=1),
            nn.ReLU(),
            nn.Conv2d(16, 32, 3, stride=2, padding=1),
            nn.ReLU(),
            nn.AdaptiveAvgPool2d((1, 1)),
            nn.Flatten(),
            nn.Linear(32, 1),
            nn.Sigmoid(),
        )

    def forward(self, x):
        return self.net(x)


class DeepfakeInferenceModel:
    """Production-ready adapter for loading a trained PyTorch checkpoint.

    Replace `model_path` with a trained model file to perform real inference.
    """

    def __init__(self, model_path=None):
        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        self.model = LightweightDeepfakeNet().to(self.device)
        if model_path:
            state = torch.load(model_path, map_location=self.device)
            self.model.load_state_dict(state)
        self.model.eval()

    @torch.no_grad()
    def predict(self, tensor):
        tensor = tensor.to(self.device)
        output = self.model(tensor)
        return float(output.squeeze().item())
