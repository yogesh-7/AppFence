package com.yogesh.appfence.ui

import android.app.Activity
import android.net.VpnService
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.yogesh.appfence.ui.screens.MainScreen
import com.yogesh.appfence.ui.screens.OnboardingScreen
import com.yogesh.appfence.ui.screens.SettingsScreen
import com.yogesh.appfence.ui.theme.AppFenceTheme
import com.yogesh.appfence.ui.viewmodel.MainViewModel
import com.yogesh.appfence.ui.viewmodel.SettingsViewModel

/**
 * Single-activity host for the entire Compose UI.
 * Handles VPN permission flow and navigation between screens.
 */
class MainActivity : ComponentActivity() {

    private lateinit var mainViewModel: MainViewModel
    private lateinit var settingsViewModel: SettingsViewModel

    /**
     * Activity result launcher for VPN permission.
     * When the user grants permission, the VPN service starts.
     */
    private val vpnPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            settingsViewModel.startVpn()
            settingsViewModel.completeOnboarding()
        } else {
            Toast.makeText(
                this,
                "VPN permission is required to control app access",
                Toast.LENGTH_LONG
            ).show()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {

        val splashScreen = installSplashScreen()
        super.onCreate(savedInstanceState)

        mainViewModel = ViewModelProvider(this)[MainViewModel::class.java]
        settingsViewModel = ViewModelProvider(this)[SettingsViewModel::class.java]


        splashScreen.setKeepOnScreenCondition { false }

        enableEdgeToEdge()

        setContent {
            AppFenceTheme {
                val navController = rememberNavController()
                val onboardingCompleted by settingsViewModel.onboardingCompleted.collectAsState()
                val networkType by settingsViewModel.networkMonitor.networkType.collectAsState()
                val isLoading by mainViewModel.isLoading.collectAsState()

                if (isLoading) {
                    com.yogesh.appfence.ui.screens.AppFenceSplashScreen()
                } else {
                    val startDestination = if (onboardingCompleted) "main" else "onboarding"

                    NavHost(
                        navController = navController,
                        startDestination = startDestination,
                        modifier = Modifier.fillMaxSize()
                    ) {
                        composable("onboarding") {
                            OnboardingScreen(onGrantVpnPermission = { requestVpnPermission() })
                        }
                        composable("main") {
                            MainScreen(
                                viewModel = mainViewModel,
                                networkType = networkType,
                                onNavigateToSettings = { navController.navigate("settings") }
                            )
                        }
                        composable("settings") {
                            SettingsScreen(
                                viewModel = settingsViewModel,
                                onNavigateBack = { navController.popBackStack() },
                                onRequestVpnPermission = { requestVpnPermission() }
                            )
                        }
                    }

                    if (onboardingCompleted && navController.currentDestination?.route == "onboarding") {
                        navController.navigate("main") {
                            popUpTo("onboarding") { inclusive = true }
                        }
                    }
                }
            }
        }
    }

    override fun onResume() {
        super.onResume()
        // Refresh VPN status (may have been stopped externally)
        settingsViewModel.refreshVpnStatus()
    }

    /**
     * Request VPN permission via the system dialog.
     * If already granted, starts VPN immediately.
     */
    private fun requestVpnPermission() {
        val prepareIntent = VpnService.prepare(this)
        if (prepareIntent != null) {
            vpnPermissionLauncher.launch(prepareIntent)
        } else {
            settingsViewModel.startVpn()
            settingsViewModel.completeOnboarding()
        }
    }
}