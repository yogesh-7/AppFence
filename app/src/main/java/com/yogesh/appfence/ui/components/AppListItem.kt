package com.yogesh.appfence.ui.components

import android.graphics.drawable.Drawable
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.SignalCellularAlt
import androidx.compose.material.icons.rounded.Wifi
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.core.graphics.drawable.toBitmap
import com.yogesh.appfence.model.AppInfo
import com.yogesh.appfence.model.AppUiState
import com.yogesh.appfence.ui.theme.AppFenceTheme
import com.yogesh.appfence.ui.theme.Primary
import com.yogesh.appfence.ui.theme.Secondary
import com.yogesh.appfence.ui.theme.StatusBlocked
import com.yogesh.appfence.ui.theme.SurfaceVariant

/**
 * A single app row showing icon, name, status badge, and
 * independent Wi-Fi and mobile data toggle switches.
 */
@Composable
fun AppListItem(
    appState: AppUiState,
    onWifiToggle: (Boolean) -> Unit,
    onMobileToggle: (Boolean) -> Unit,
    modifier: Modifier = Modifier
) {
    val cardAlpha by animateFloatAsState(
        targetValue = if (appState.wifiAllowed || appState.mobileAllowed) 1f else 0.7f,
        animationSpec = tween(300),
        label = "cardAlpha"
    )

    Card(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 4.dp)
            .alpha(cardAlpha),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = SurfaceVariant.copy(alpha = 0.6f)
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // App icon
            AppIcon(drawable = appState.appInfo.icon)

            Spacer(modifier = Modifier.width(12.dp))

            // App name, package name, and status badge
            Column(
                modifier = Modifier.weight(1f)
            ) {
                Text(
                    text = appState.appInfo.appName,
                    style = MaterialTheme.typography.titleSmall,
                    color = MaterialTheme.colorScheme.onSurface,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                Text(
                    text = appState.appInfo.packageName,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.6f),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                Spacer(modifier = Modifier.height(4.dp))
                StatusBadge(status = appState.status)
            }

            Spacer(modifier = Modifier.width(8.dp))

            // Toggle switches column
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(2.dp)
            ) {
                // Wi-Fi toggle
                ToggleRow(
                    icon = {
                        Icon(
                            imageVector = Icons.Rounded.Wifi,
                            contentDescription = "Wi-Fi",
                            tint = if (appState.wifiAllowed) Primary else StatusBlocked.copy(alpha = 0.5f),
                            modifier = Modifier.size(16.dp)
                        )
                    },
                    checked = appState.wifiAllowed,
                    onCheckedChange = onWifiToggle
                )
                // Mobile data toggle
                ToggleRow(
                    icon = {
                        Icon(
                            imageVector = Icons.Rounded.SignalCellularAlt,
                            contentDescription = "Mobile Data",
                            tint = if (appState.mobileAllowed) Secondary else StatusBlocked.copy(alpha = 0.5f),
                            modifier = Modifier.size(16.dp)
                        )
                    },
                    checked = appState.mobileAllowed,
                    onCheckedChange = onMobileToggle
                )
            }
        }
    }
}

@Preview
@Composable
private fun AppIconPreview() {
    AppFenceTheme {
        Box(
            modifier = Modifier
                .background(MaterialTheme.colorScheme.background)
                .padding(16.dp)
        ) {
            AppIcon(drawable = null)
        }
    }
}

@Preview
@Composable
private fun ToggleRowPreview() {
    var checked by remember { mutableStateOf(true) }
    AppFenceTheme {
        Box(
            modifier = Modifier
                .background(MaterialTheme.colorScheme.background)
                .padding(16.dp)
        ) {
            ToggleRow(
                icon = {
                    Icon(
                        imageVector = Icons.Rounded.Wifi,
                        contentDescription = null,
                        tint = Primary
                    )
                },
                checked = checked,
                onCheckedChange = { checked = it }
            )
        }
    }
}

@Preview
@Composable
fun AppListItemPreview() {
    val mockApp = AppUiState(
        appInfo = AppInfo(
            packageName = "com.example.app",
            appName = "Example App",
            icon = null,
            isSystemApp = false,
            uid = 10001
        ),
        wifiAllowed = true,
        mobileAllowed = false
    )
    AppFenceTheme {
        Box(modifier = Modifier.background(MaterialTheme.colorScheme.background)) {
            AppListItem(
                appState = mockApp,
                onWifiToggle = {},
                onMobileToggle = {}
            )
        }
    }
}

@Composable
private fun ToggleRow(
    icon: @Composable () -> Unit,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        icon()
        Switch(
            checked = checked,
            onCheckedChange = onCheckedChange,
            modifier = Modifier.scale(0.7f),
            colors = SwitchDefaults.colors(
                checkedThumbColor = Primary,
                checkedTrackColor = Primary.copy(alpha = 0.3f),
                uncheckedThumbColor = StatusBlocked.copy(alpha = 0.8f),
                uncheckedTrackColor = StatusBlocked.copy(alpha = 0.15f),
                uncheckedBorderColor = StatusBlocked.copy(alpha = 0.3f)
            )
        )
    }
}

@Composable
private fun AppIcon(drawable: Drawable?) {
    if (drawable != null) {
        Image(
            bitmap = drawable.toBitmap(width = 96, height = 96).asImageBitmap(),
            contentDescription = null,
            modifier = Modifier
                .size(44.dp)
                .clip(RoundedCornerShape(12.dp)),
            contentScale = ContentScale.Crop
        )
    } else {
        Box(
            modifier = Modifier
                .size(44.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(SurfaceVariant),
            contentAlignment = Alignment.Center
        ) {
            Text("?", style = MaterialTheme.typography.titleMedium)
        }
    }
}
