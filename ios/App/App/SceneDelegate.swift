import UIKit
import Capacitor

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = scene as? UIWindowScene else { return }

        window = UIWindow(windowScene: windowScene)
        window?.rootViewController = MainViewController()
        window?.makeKeyAndVisible()

        SceneDelegateProxy.shared.scene(scene, willConnectTo: session, options: connectionOptions)
    }

    func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
        SceneDelegateProxy.shared.scene(scene, openURLContexts: URLContexts)
    }

    func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
        SceneDelegateProxy.shared.scene(scene, continue: userActivity)
    }
}

// 画面全体が上下にびよーんと伸び縮み（バウンス）してカクつくのを止める
// リストなど中のスクロールはそのまま使える
class MainViewController: CAPBridgeViewController {
    private let loadingView = LoadingOverlayView()
    private var observations: [NSKeyValueObservation] = []

    override func capacitorDidLoad() {
        super.capacitorDidLoad()
        webView?.scrollView.bounces = false
        webView?.scrollView.alwaysBounceVertical = false
        webView?.scrollView.alwaysBounceHorizontal = false
    }

    // 最初のページが表示されるまで、起動画面と同じ見た目＋読み込みバーを出しておく
    // （これがないと、本番サイトを読み込む間ずっと真っ黒になる）
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = LoadingOverlayView.background
        loadingView.frame = view.bounds
        loadingView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        loadingView.onRetry = { [weak self] in self?.retry() }
        view.addSubview(loadingView)
        guard let webView = webView else { return }
        observations = [
            webView.observe(\.estimatedProgress, options: [.new]) { [weak self] wv, _ in
                self?.loadingView.setProgress(wv.estimatedProgress)
            },
            webView.observe(\.isLoading, options: [.new]) { [weak self] wv, _ in
                if !wv.isLoading { self?.checkLoaded() }
            },
        ]
    }

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        view.bringSubviewToFront(loadingView)
    }

    // 読み込みが止まったら、ページに中身があるかを見て閉じる。中身がなければ失敗として再読み込みを出す
    private func checkLoaded() {
        guard loadingView.superview != nil, let webView = webView else { return }
        webView.evaluateJavaScript("location.protocol.startsWith('http') && !!document.body && document.body.children.length > 0") { [weak self] result, _ in
            guard let self = self else { return }
            if (result as? Bool) == true {
                self.observations = []
                self.loadingView.finish()
            } else {
                self.loadingView.showFailed()
            }
        }
    }

    private func retry() {
        guard let webView = webView else { return }
        let url = webView.url.flatMap { $0.scheme?.hasPrefix("http") == true ? $0 : nil } ?? bridge?.config.serverURL
        if let url = url { webView.load(URLRequest(url: url)) }
    }
}

// 起動画面（LaunchScreen の Splash 画像）と同じ見た目に、ドット風の読み込みバーを重ねる
final class LoadingOverlayView: UIView {
    static let background = UIColor(red: 8 / 255, green: 6 / 255, blue: 20 / 255, alpha: 1)
    private static let green = UIColor(red: 113 / 255, green: 253 / 255, blue: 40 / 255, alpha: 1)
    private static let segments = 12
    // Splash 画像は 2732px 四方で、ロゴは中央の高さ 590px
    private static let splashSize: CGFloat = 2732
    private static let logoHeight: CGFloat = 590

    var onRetry: (() -> Void)?

    private let splash = UIImageView(image: UIImage(named: "Splash"))
    private let bar = UIStackView()
    private var blocks: [UIView] = []
    private let label = UILabel()
    private let retryButton = UIButton(type: .system)
    private var shown = 0
    private var slowTimer: Timer?
    private var dotsTimer: Timer?
    private var dots = 0
    private var failed = false

    override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = Self.background
        splash.contentMode = .scaleAspectFill
        splash.clipsToBounds = true
        addSubview(splash)

        bar.axis = .horizontal
        bar.spacing = 3
        bar.distribution = .fillEqually
        for _ in 0..<Self.segments {
            let b = UIView()
            b.backgroundColor = Self.green.withAlphaComponent(0.15)
            blocks.append(b)
            bar.addArrangedSubview(b)
        }
        addSubview(bar)

        label.font = .monospacedSystemFont(ofSize: 12, weight: .bold)
        label.textColor = Self.green.withAlphaComponent(0.8)
        label.textAlignment = .center
        label.numberOfLines = 0
        addSubview(label)

        var config = UIButton.Configuration.filled()
        config.title = "もう一度読み込む"
        config.baseBackgroundColor = Self.green
        config.baseForegroundColor = Self.background
        config.cornerStyle = .small
        config.contentInsets = NSDirectionalEdgeInsets(top: 12, leading: 24, bottom: 12, trailing: 24)
        retryButton.configuration = config
        retryButton.isHidden = true
        retryButton.addTarget(self, action: #selector(tapRetry), for: .touchUpInside)
        addSubview(retryButton)

        updateLabel()
        dotsTimer = Timer.scheduledTimer(withTimeInterval: 0.4, repeats: true) { [weak self] _ in
            guard let self = self else { return }
            self.dots = (self.dots + 1) % 4
            self.updateLabel()
        }
        startSlowTimer()
    }

    required init?(coder: NSCoder) { fatalError() }

    override func layoutSubviews() {
        super.layoutSubviews()
        splash.frame = bounds
        // aspectFill なので、画像の縮尺は画面の長い辺で決まる
        let scale = max(bounds.width, bounds.height) / Self.splashSize
        let logoBottom = bounds.midY + Self.logoHeight * scale / 2
        let barWidth = min(200, bounds.width - 80)
        bar.frame = CGRect(x: bounds.midX - barWidth / 2, y: logoBottom + 36, width: barWidth, height: 8)
        let labelWidth = bounds.width - 48
        let labelHeight = label.sizeThatFits(CGSize(width: labelWidth, height: .greatestFiniteMagnitude)).height
        label.frame = CGRect(x: 24, y: bar.frame.maxY + 14, width: labelWidth, height: labelHeight)
        let size = retryButton.sizeThatFits(.zero)
        retryButton.frame = CGRect(x: bounds.midX - size.width / 2, y: label.frame.maxY + 20, width: size.width, height: size.height)
    }

    func setProgress(_ progress: Double) {
        // 戻らないように、増えたときだけ反映する
        let n = min(Self.segments, Int((progress * Double(Self.segments)).rounded(.down)))
        guard n > shown else { return }
        shown = n
        for (i, b) in blocks.enumerated() {
            b.backgroundColor = i < n ? Self.green : Self.green.withAlphaComponent(0.15)
        }
    }

    func finish() {
        setProgress(1)
        stopTimers()
        UIView.animate(withDuration: 0.3, delay: 0.1, options: [.curveEaseOut]) {
            self.alpha = 0
        } completion: { _ in
            self.removeFromSuperview()
        }
    }

    func showFailed() {
        failed = true
        slowTimer?.invalidate()
        updateLabel()
        retryButton.isHidden = false
        setNeedsLayout()
    }

    @objc private func tapRetry() {
        failed = false
        retryButton.isHidden = true
        shown = 0
        blocks.forEach { $0.backgroundColor = Self.green.withAlphaComponent(0.15) }
        updateLabel()
        startSlowTimer()
        onRetry?()
    }

    // 時間がかかっているときは、止まっていないことが分かるように一言出し、再読み込みもできるようにする
    private func startSlowTimer() {
        slowTimer?.invalidate()
        slowTimer = Timer.scheduledTimer(withTimeInterval: 10, repeats: false) { [weak self] _ in
            guard let self = self, !self.failed else { return }
            self.retryButton.isHidden = false
            self.updateLabel()
        }
    }

    private func updateLabel() {
        // 点の数が変わっても文字の位置がずれないように、空白で幅をそろえる
        let dotText = String(repeating: ".", count: dots) + String(repeating: " ", count: 3 - dots)
        if failed {
            label.text = "読み込めませんでした\n電波の良いところで、もう一度お試しください"
        } else if retryButton.isHidden {
            label.text = "LOADING" + dotText
        } else {
            label.text = "通信に時間がかかっています" + dotText
        }
        setNeedsLayout()
    }

    private func stopTimers() {
        slowTimer?.invalidate()
        dotsTimer?.invalidate()
    }
}
